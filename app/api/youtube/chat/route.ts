import { getVideoDetails } from "@/actions/youtube/getVideoDetails";
import fetchTranscript from "@/tools/fetchTranscript";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createOpenRouter } from '@openrouter/ai-sdk-provider';


const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

const openRouterModel = openRouter("deepseek/deepseek-chat-v3-0324:free");
const openaiModel = openai("gpt-4o-mini");

export async function POST(req: Request) {
    const { messages, videoId } = await req.json();


    const videoDetails = await getVideoDetails(videoId);

    const systemMessage = `You are an AI agent ready to accept questions from the 
    user about ONE specific video. The video ID in question is ${videoId} but you'll 
    refer to this as ${videoDetails?.title || "Selected Video"}. Use emojis to 
    make the conversation more engaging. If an error occurs, explain it to the 
    user and ask them to try again later. If the error suggest the user upgrade, 
    explain that they must upgrade to use the feature, tell them to go to 'Manage Plan'
     in the header and upgrade. If any tool is used, analyse the response and if 
     it contains a cache, explain that the transcript is cached because they 
     previously transcribed the video saving the user a token - use words like database
      instead of cache to make it more easy to understand. Format for notion.`;

    const result = streamText({
        model: openaiModel,
        messages: [{ role: "system", content: systemMessage }, ...messages],
        tools: {
            fetchTranscript: fetchTranscript,
        }
    });
    return result.toDataStreamResponse({
        getErrorMessage: (error) => {
            console.error("Server-side error:", error);
            if (error instanceof Error) {
                return `${error.name}: ${error.message}`;
            }
            return String(error);
        },
    });
}