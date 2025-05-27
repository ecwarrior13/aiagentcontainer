"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import Vapi from "@vapi-ai/web"
import { assistantOptions, type InterviewDetails } from "@/types/interviewTypes"

interface UseVapiInterviewProps {
    formData: InterviewDetails | null
    onInterviewEnd?: () => void
    onConversationEnd?: (conversation: Array<{ role: string; content: string }>) => void
}

interface VapiMessage {
    role: string;
    content?: string;
    message?: string;
    time?: number;
    endTime?: number;
    secondsFromStart?: number;
    duration?: number;
    source?: string;
    type?: string;
    transcriptType?: string;
}

interface VapiTranscript {
    type: 'transcript';
    transcriptType: string;
    conversation: Array<{ role: string; content: string }>;
    messages: VapiMessage[];
    messagesOpenAIFormatted: Array<{ role: string; content: string }>;
}

export function useVapiInterview({ formData, onInterviewEnd, onConversationEnd }: UseVapiInterviewProps) {
    const [vapi] = useState(() => new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!))
    const [isCallActive, setIsCallActive] = useState(false)
    const [isStarting, setIsStarting] = useState(false)
    const [conversation, setConversation] = useState<Array<{ role: string; content: string }>>([])

    // Event handlers
    const handleCallStart = useCallback(() => {
        setIsCallActive(true)
        setIsStarting(false)
        //reset conversation when call starts
        setConversation([])
    }, [])

    const handleCallEnd = useCallback(() => {
        setIsCallActive(false)
        setIsStarting(false)
        // Pass the conversation to the parent component
        if (conversation.length > 0) {
            onConversationEnd?.(conversation)
        }
        onInterviewEnd?.()
        toast.success("Interview completed successfully")
    }, [onInterviewEnd, onConversationEnd, conversation])

    const handleError = useCallback((error: Error | unknown) => {
        console.error("Error during call:", error)
        toast.error("An error occurred during the call. Please try again.")
        setIsCallActive(false)
        setIsStarting(false)
    }, [])

    const handleSpeechStart = useCallback(() => {
        console.log("Speech started")
    }, [])

    const handleSpeechEnd = useCallback(() => {
        console.log("Speech ended")
        console.log(conversation)
    }, [conversation])

    const handleMessage = useCallback((msg: VapiMessage | VapiTranscript) => {
        console.log('Received VAPI message:', JSON.stringify(msg, null, 2));

        // Handle transcript type
        if ('type' in msg && msg.type === 'transcript' && msg.transcriptType === 'final' && 'conversation' in msg) {
            // Only add non-system messages to the conversation
            const validMessages = msg.conversation.filter((message: { role: string; content: string }) =>
                message.role !== 'system' &&
                message.content &&
                message.content.trim() !== ''
            );

            if (validMessages.length > 0) {
                console.log('Adding transcript messages:', validMessages);
                setConversation(prev => {
                    // Create a map of existing messages to avoid duplicates
                    const existingMessages = new Map(
                        prev.map(msg => [`${msg.role}-${msg.content}`, msg])
                    );

                    // Add new messages that don't already exist
                    validMessages.forEach((msg: { role: string; content: string }) => {
                        const key = `${msg.role}-${msg.content}`;
                        if (!existingMessages.has(key)) {
                            existingMessages.set(key, msg);
                        }
                    });

                    const newConversation = Array.from(existingMessages.values());
                    console.log('Updated conversation:', newConversation);
                    return newConversation;
                });
            }
            return;
        }

        // Handle individual messages (fallback)
        if (!('role' in msg)) {
            console.warn('Invalid message format - missing role:', msg);
            return;
        }

        const content = 'message' in msg ? msg.message : 'content' in msg ? msg.content : null;

        // Skip if no content
        if (!content || content.trim() === '') {
            console.warn('Received message with no content:', msg);
            return;
        }

        // Map 'bot' role to 'assistant' for consistency
        const role = msg.role === 'bot' ? 'assistant' : msg.role;

        console.log('Adding individual message to conversation:', { role, content: content.trim() });

        setConversation((prev) => {
            const newConversation = [...prev, {
                role,
                content: content.trim()
            }];
            console.log('Updated conversation:', newConversation);
            return newConversation;
        });
    }, [])

    // Setup event listeners
    useEffect(() => {
        vapi.on("call-start", handleCallStart)
        vapi.on("call-end", handleCallEnd)
        vapi.on("error", handleError)
        vapi.on("speech-start", handleSpeechStart)
        vapi.on("speech-end", handleSpeechEnd)
        vapi.on("message", handleMessage)


        return () => {
            vapi.off("call-start", handleCallStart)
            vapi.off("call-end", handleCallEnd)
            vapi.off("error", handleError)
            vapi.off("speech-start", handleSpeechStart)
            vapi.off("speech-end", handleSpeechEnd)
            vapi.off("message", handleMessage)
        }
    }, [vapi,
        handleCallStart,
        handleCallEnd,
        handleError,
        handleSpeechStart,
        handleSpeechEnd,
        handleMessage,])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (isCallActive) {
                vapi.stop()
            }
        }
    }, [vapi, isCallActive])

    const startCall = useCallback(async () => {
        if (!formData) {
            toast.error("Interview data not loaded")
            return false
        }

        // Validate required fields
        const questionsToAsk = formData.questionList
            ?.map((question) => question?.question)
            .filter(Boolean)
            .join(", ")

        if (!questionsToAsk) {
            toast.error("No questions to ask. Please add some questions.")
            return false
        }

        if (!formData.candidateName || !formData.jobPosition) {
            toast.error("Missing required fields. Please fill in all fields.")
            return false
        }

        try {
            setIsStarting(true)

            // Clone assistant options to avoid mutating the original
            const assistant = JSON.parse(JSON.stringify(assistantOptions))

            // Helper function to replace placeholders
            const replacePlaceholders = (text: string) => {
                return text
                    .replace(/{{userName}}/g, formData.candidateName || "Candidate")
                    .replace(/{{jobPosition}}/g, formData.jobPosition || "Job Position")
                    .replace(/{{questionList}}/g, questionsToAsk || "No questions available")
            }

            // Update assistant configuration
            assistant.firstMessage = replacePlaceholders(assistant.firstMessage)
            assistant.model.messages[0].content = replacePlaceholders(assistant.model.messages[0].content)

            // Start the call
            await vapi.start(assistant)
            return true
        } catch (error) {
            console.error("Error starting call:", error)
            toast.error("Failed to start the interview. Please try again.")
            setIsStarting(false)
            return false
        }
    }, [formData, vapi])

    const endCall = useCallback(async () => {
        try {
            if (isCallActive) {
                await vapi.stop()
            }
            setIsCallActive(false)
            setIsStarting(false)
        } catch (error) {
            console.error("Error ending call:", error)
            toast.error("Error ending the call")
        }
    }, [vapi, isCallActive])

    return {
        isCallActive,
        isStarting,
        startCall,
        endCall,
        vapi,
        conversation,
    }
}
