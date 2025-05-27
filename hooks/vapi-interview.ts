"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import Vapi from "@vapi-ai/web"
import { assistantOptions, type InterviewDetails } from "@/types/interviewTypes"

interface VapiMessage {
    type: string
    transcriptType?: string
    role: string
    transcript: string
}

interface UseVapiInterviewProps {
    formData: InterviewDetails | null
    onInterviewEnd?: () => void
    onConversationEnd?: (messages: SavedMessage[]) => void
}

interface SavedMessage {
    role: string
    content: string
}

export function useVapiInterview({ formData, onInterviewEnd, onConversationEnd }: UseVapiInterviewProps) {
    const [vapi] = useState(() => new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!))
    const [isCallActive, setIsCallActive] = useState(false)
    const [isStarting, setIsStarting] = useState(false)
    const [messages, setMessages] = useState<SavedMessage[]>([])

    //event handlers
    const handleCallStart = useCallback(() => {
        setIsCallActive(true)
        setIsStarting(false)
        //reset conversation when call starts
        setMessages([])
    }, [])

    const handleCallEnd = useCallback(() => {
        setIsCallActive(false)
        setIsStarting(false)
        toast.success("Interview completed successfully")
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
        messages,
        vapi,
        startCall,
        endCall
    }
}
