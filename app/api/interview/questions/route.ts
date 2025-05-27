import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { claude_Interview_Prompt, InterviewFormData } from "@/types/interviewTypes"
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const formData: InterviewFormData = await req.json();

        //add rate limiting
        //add authentication check

        const prompt = claude_Interview_Prompt
            .replace("{{jobTitle}}", formData.jobPosition)
            .replace("{{jobDescription}}", formData.jobDescription)
            .replace("{{duration}}", formData.duration)
            .replace("{{type}}", formData.type.join(", "))
            .replace("{{experience_level}}", formData.experience_level);

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

        const parsedResponse = JSON.parse(cleanedText);

        return NextResponse.json({
            success: true,
            questions: parsedResponse.interviewQuestions
        });
    } catch (error) {
        console.error("Error generating questions:", error);
        return NextResponse.json(
            { success: false, error: "Failed to generate questions" },
            { status: 500 }
        );
    }
}
