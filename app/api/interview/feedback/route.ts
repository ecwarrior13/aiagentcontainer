import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { claude_Feedback_Prompt } from "@/types/interviewTypes"
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { conversation, candidateName, jobPosition } = await req.json();

    // Validate required fields
    if (!conversation) {
        console.error("Missing conversation data");
        return NextResponse.json(
            { success: false, error: "Missing conversation data" },
            { status: 400 }
        );
    }

    if (!candidateName) {
        console.error("Missing candidate name");
        return NextResponse.json(
            { success: false, error: "Missing candidate name" },
            { status: 400 }
        );
    }

    if (!jobPosition) {
        console.error("Missing job position");
        return NextResponse.json(
            { success: false, error: "Missing job position" },
            { status: 400 }
        );
    }

    // Format the conversation into a readable string
    console.log("Conversation data:", conversation)

    const formattedConversation = conversation
        .map((msg: { role: string; content: string }) =>
            `${msg.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${msg.content}`
        )
        .join('\n\n');

    const FINAL_PROMPT = claude_Feedback_Prompt
        .replace("{{conversation}}", formattedConversation)
        .replace("{{candidateName}}", candidateName)
        .replace("{{jobPosition}}", jobPosition);

    try {
        console.log("Sending prompt to OpenAI...")
        console.log("Final prompt:", FINAL_PROMPT)

        const { text } = await generateText({
            model: openai("gpt-4"),
            prompt: FINAL_PROMPT,
        })

        console.log("Received response from OpenAI")
        console.log("Raw response:", text)

        // Parse the response text to ensure it's valid JSON
        let feedbackData;
        try {
            feedbackData = JSON.parse(text);
        } catch (error) {
            console.error("Error parsing feedback JSON:", error);
            return NextResponse.json(
                { success: false, error: "Invalid feedback format" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: feedbackData.feedback
        })

    } catch (error) {
        console.error("Error generating feedback:", error);
        return NextResponse.json(
            { success: false, error: "Failed to generate feedback" },
            { status: 500 }
        );
    }
}