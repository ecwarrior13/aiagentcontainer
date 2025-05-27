"use client"

import { createClient } from "@/utils/supabase/client"
import { useState, useCallback } from "react"
import { toast } from "sonner"

interface FeedbackResponse {
    success: boolean
    data?: {
        rating: {
            technical: number;
            communication: number;
            problemSolving: number;
            experience: number;
        };
        summary: string;
        goodfit: string;
        question: {
            bestquestionanswered: string;
            highlightofanswer: string;
        };
        recommendation: string;
    }
    error?: string
}

export function useInterviewFeedback() {
    const [feedback, setFeedback] = useState<FeedbackResponse["data"] | null>(null)
    const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)
    const [feedbackError, setFeedbackError] = useState<string | null>(null)

    const generateFeedback = useCallback(
        async (
            conversation: Array<{ role: string; content: string }>,
            interviewData: {
                candidateName: string
                jobPosition: string
                interview_id: string
            },
        ) => {
            if (conversation.length === 0) {
                console.error("No conversation data available");
                toast.error("No conversation data available to generate feedback")
                return null
            }

            try {
                setIsGeneratingFeedback(true)
                setFeedbackError(null)

                console.log("Generating feedback with conversation:", conversation);
                console.log("Interview data:", interviewData);

                const formattedConversation = conversation.map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                }))

                console.log("Formatted conversation:", formattedConversation);

                const response = await fetch("/api/interview/feedback", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        conversation: formattedConversation,
                        candidateName: interviewData.candidateName,
                        jobPosition: interviewData.jobPosition,
                        interview_id: interviewData.interview_id,
                    }),
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log("Feedback API response:", result);

                if (!result.success) {
                    throw new Error(result.error || "Failed to generate feedback");
                }

                // Parse the feedback data if it's a string
                const feedbackData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
                setFeedback(feedbackData);
                return feedbackData;

            } catch (error) {
                console.error("Error generating feedback:", error)
                const errorMessage = error instanceof Error ? error.message : "Failed to generate feedback"
                setFeedbackError(errorMessage)
                toast.error(errorMessage)
                return null
            } finally {
                setIsGeneratingFeedback(false)
            }
        },
        [],
    )

    const resetFeedback = useCallback(() => {
        setFeedback(null)
        setFeedbackError(null)
    }, [])

    return {
        feedback,
        isGeneratingFeedback,
        feedbackError,
        generateFeedback,
        resetFeedback,
    }
}
