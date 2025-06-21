"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import Vapi from "@vapi-ai/web"
import { assistantOptions, type InterviewDetails } from "@/types/interviewTypes"
import { type ColdSalesAgentDetails, MultiToolAgentSofie } from "@/types/salesagentTypes"

interface VapiMessage {
    type: string
    transcriptType?: string
    role: string
    transcript: string
}

interface VapiCallStartEvent {
    callId?: string
    [key: string]: unknown
}

interface UseVapiInterviewProps {
    formData: InterviewDetails | ColdSalesAgentDetails | null
    onInterviewEnd?: () => void
    onCallEnd?: () => void
    onConversationEnd?: (messages: SavedMessage[]) => void
}

interface SavedMessage {
    role: string
    content: string
}

// Type guard functions
const isInterviewDetails = (data: unknown): data is InterviewDetails => {
    return data !== null && typeof data === 'object' &&
        'questionList' in (data as Record<string, unknown>) &&
        'candidateName' in (data as Record<string, unknown>) &&
        'jobPosition' in (data as Record<string, unknown>)
}

const isColdSalesAgentDetails = (data: unknown): data is ColdSalesAgentDetails => {
    return data !== null && typeof data === 'object' &&

        'companyName' in (data as Record<string, unknown>) &&
        'contactName' in (data as Record<string, unknown>) &&
        'phoneNumber' in (data as Record<string, unknown>)
    // Add more specific properties that distinguish ColdSalesAgentDetails if needed
}

export function useVapiInterview({ formData, onInterviewEnd, onConversationEnd }: UseVapiInterviewProps) {
    const [vapi] = useState(() => new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!))
    const [isCallActive, setIsCallActive] = useState(false)
    const [isStarting, setIsStarting] = useState(false)
    const [messages, setMessages] = useState<SavedMessage[]>([])
    const [currentCallId, setCurrentCallId] = useState<string | null>(null)

    //event handlers
    const handleCallStart = useCallback((event?: VapiCallStartEvent) => {
        setIsCallActive(true)
        setIsStarting(false)
        //reset conversation when call starts
        setMessages([])

        // Try to get call ID from event data
        if (event?.callId) {
            setCurrentCallId(event.callId)
            console.log("Call started with ID:", event.callId)
        } else {
            console.log("Call started without ID in event data")

            // Fallback: Check for call ID after a short delay
            setTimeout(() => {
                // Try to access call ID from vapi instance properties
                const vapiInstance = vapi as unknown as Record<string, unknown>
                if (vapiInstance.callId) {
                    setCurrentCallId(vapiInstance.callId as string)
                    console.log("Call ID found after delay:", vapiInstance.callId)
                } else if (vapiInstance.call && typeof vapiInstance.call === 'object' && vapiInstance.call !== null && 'id' in vapiInstance.call) {
                    setCurrentCallId((vapiInstance.call as Record<string, unknown>).id as string)
                    console.log("Call ID found in call object:", (vapiInstance.call as Record<string, unknown>).id)
                } else {
                    console.log("No call ID found after delay")
                }
            }, 1000)
        }
    }, [vapi])

    const handleCallEnd = useCallback(() => {
        setIsCallActive(false)
        setIsStarting(false)
        toast.success("Call completed successfully")
        onInterviewEnd?.()
        if (messages.length > 0) {
            onConversationEnd?.(messages)
        }
    }, [onInterviewEnd, messages, onConversationEnd])

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
    }, [])

    const handleMessage = useCallback((message: VapiMessage) => {
        if (message.type === "transcript" && message.transcriptType === "final") {
            const newMessage = { role: message.role, content: message.transcript };
            setMessages((prev) => [...prev, newMessage])
        }
    }, [])

    //set up listeners
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
            toast.error("Call data not loaded")
            return false
        }

        try {
            setIsStarting(true)

            // Handle InterviewDetails type
            if (isInterviewDetails(formData)) {
                // Validate interview-specific fields
                const questionsToAsk = formData.questionList
                    ?.map((question) => question?.question)
                    .filter(Boolean)
                    .join(", ")

                if (!questionsToAsk) {
                    toast.error("No questions to ask. Please add some questions.")
                    setIsStarting(false)
                    return false
                }

                if (!formData.candidateName || !formData.jobPosition) {
                    toast.error("Missing required fields. Please fill in all fields.")
                    setIsStarting(false)
                    return false
                }

                // Clone assistant options for interview
                const assistant = JSON.parse(JSON.stringify(assistantOptions))

                // Helper function to replace placeholders for interview
                const replacePlaceholders = (text: string) => {
                    return text
                        .replace(/{{userName}}/g, formData.candidateName || "Candidate")
                        .replace(/{{jobPosition}}/g, formData.jobPosition || "Job Position")
                        .replace(/{{questionList}}/g, questionsToAsk || "No questions available")
                }

                // Update assistant configuration for interview
                assistant.firstMessage = replacePlaceholders(assistant.firstMessage)
                assistant.model.messages[0].content = replacePlaceholders(assistant.model.messages[0].content)

                // Start the interview call and capture the response
                const result = await vapi.start(assistant)
                console.log("Vapi start result:", result)

                // Check if result contains call ID
                if (result && typeof result === 'object' && 'id' in result) {
                    setCurrentCallId(result.id as string)
                    console.log("Call started with ID from result:", result.id)
                }

                return true

            }
            // Handle ColdSalesAgentDetails type
            else if (isColdSalesAgentDetails(formData)) {
                // Validate sales agent specific fields
                if (!formData.companyName || !formData.contactName || !formData.phoneNumber) {
                    toast.error("Missing required fields. Please fill in all fields.")
                    setIsStarting(false)
                    return false
                }

                // Clone sales agent assistant options
                const salesAgentAssistant = JSON.parse(JSON.stringify(MultiToolAgentSofie))

                // Start the sales call and capture the response
                const result = await vapi.start(salesAgentAssistant)
                console.log("Vapi start result:", result)

                // Check if result contains call ID
                if (result && typeof result === 'object' && 'id' in result) {
                    setCurrentCallId(result.id as string)
                    console.log("Call started with ID from result:", result.id)
                }

                return true

            } else {
                toast.error("Invalid call data type")
                setIsStarting(false)
                return false
            }

        } catch (error) {
            console.error("Error starting call:", error)
            toast.error("Failed to start the call. Please try again.")
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
        messages,
        currentCallId,
        vapi,
        startCall,
        endCall
    }
}