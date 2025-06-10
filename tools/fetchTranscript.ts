import { getYoutubeTranscripts } from "@/actions/youtube/getVideoTranscripts";
import { tool } from "ai";
import { z } from "zod";

const fetchTranscript = tool({
    description: "Use this tool to fetch the transcript of a YouTube video",
    parameters: z.object({
        videoId: z
            .string()
            .describe("The ID of the YouTube video to fetch the transcript for"),
    }),
    execute: async ({ videoId }) => {
        const transcript = await getYoutubeTranscripts(videoId);
        return (
            transcript
        )
    }
})

export default fetchTranscript;
