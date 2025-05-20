"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { claude_Interview_Prompt, InterviewFormData } from "@/types/interviewTypes"



export async function generateInterviewQuestions(formData: InterviewFormData) {
    try {
        const { jobPosition, jobDescription, duration, experience_level, type } = formData

        const prompt = claude_Interview_Prompt
            .replace("{{jobTitle}}", jobPosition)
            .replace("{{jobDescription}}", jobDescription)
            .replace("{{duration}}", duration)
            .replace("{{type}}", type.join(", "))
            .replace("{{experience_level}}", experience_level);

        console.log("Sending prompt to OpenAI...")

        const { text } = await generateText({
            model: openai("gpt-4o"),
            prompt,
        })
        console.log("Received response from OpenAI")

        // Clean the response text by removing markdown code block formatting
        let cleanedText = text

        // Check if the response contains markdown code blocks
        if (text.includes("```")) {
            console.log("Response contains markdown code blocks, cleaning...")

            // Extract content between code block delimiters
            const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
            if (codeBlockMatch && codeBlockMatch[1]) {
                cleanedText = codeBlockMatch[1].trim()
                console.log("Extracted JSON from code block")
            }
        }

        // Parse the cleaned response as JSON
        try {
            console.log("Attempting to parse JSON...")
            const parsedResponse = JSON.parse(cleanedText)
            console.log("JSON parsed successfully")

            if (parsedResponse && parsedResponse.interviewQuestions && Array.isArray(parsedResponse.interviewQuestions)) {
                console.log(`Found ${parsedResponse.interviewQuestions.length} questions`)
                return {
                    success: true,
                    questions: parsedResponse.interviewQuestions,
                }
            } else {
                console.error("Response has unexpected structure:", parsedResponse)
                return {
                    success: false,
                    error: "Invalid response format",
                    questions: [],
                }
            }
        } catch (error) {
            console.error("Error parsing response:", error)
            console.log("Failed JSON content:", cleanedText)

            // Try to extract questions using regex as a fallback
            try {
                console.log("Attempting regex extraction as fallback...")
                const questionRegex = /"question":\s*"([^"]+)"/g
                const questions = []
                let match

                while ((match = questionRegex.exec(cleanedText)) !== null) {
                    questions.push({
                        question: match[1],
                        explanation: "",
                        type: "",
                        experience_level: "",
                    })
                }

                if (questions.length > 0) {
                    console.log(`Extracted ${questions.length} questions using regex`)
                    return { success: true, questions }
                }
            } catch (e) {
                console.error("Regex extraction failed:", e)
            }

            // If all else fails, create a single question with the error
            return {
                success: true,
                questions: [
                    {
                        question: "There was an error generating questions. Please try again.",
                        explanation: "The AI returned an invalid response format. Error: " + (error as Error).message,
                        type: "Error",
                        experience_level: "",
                    },
                ],
            }
        }
    } catch (error) {
        console.error("Error generating questions:", error)
        return {
            success: false,
            error: "Failed to generate questions",
            questions: [],
        }
    }
}
