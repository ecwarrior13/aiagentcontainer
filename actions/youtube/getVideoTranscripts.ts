"use server";

import { VideoTranscript } from "@/types/youtubeTypes";
import { createClient } from "@/utils/supabase/server";
import { Innertube } from "youtubei.js";

type TranscriptResults = {
    success: boolean;
    error?: string;
    data?: VideoTranscript[];
}

const youtube = await Innertube.create({
    lang: "en",
    location: "US",
    retrieve_player: false,
})

function formatTimestamp(start_ms: number): string {
    const totalSeconds = Math.floor(start_ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}


async function fetchTranscripts(videoId: string): Promise<VideoTranscript[]> {
    try {
        const info = await youtube.getInfo(videoId);
        const transcriptData = await info.getTranscript();
        const transcripts: VideoTranscript[] =
            transcriptData.transcript.content?.body?.initial_segments.map((segment) => ({
                text: segment.snippet.text ?? "N/A",
                timestamp: formatTimestamp(Number(segment.start_ms)),
            })) ?? [];

        return transcripts;

    } catch (error) {
        console.error("Error fetching transcripts:", error);
        return [];
    }

}

export async function getYoutubeTranscripts(videoId: string) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return {
                success: false,
                error: "User is not authenticated, please login"
            }
        }
        console.log("Fetching transcripts for videoId:", videoId);

        //check if video transcriptst already in the database
        const { data: existingTranscripts, error: existingError } = await supabase
            .from("transcript")
            .select("*")
            .eq("video_id", videoId)
            .single();

        // if (existingError) {
        //     return {
        //         success: false,
        //         error: "Error fetching existing transcripts"
        //     }
        // }

        if (existingTranscripts) {
            return {
                success: true,
                data: JSON.parse(existingTranscripts.transcript)
            }
        }
        // if no transcripts in the database, fetch from youtube
        //fetch transcripts from youtube
        const transcripts = await fetchTranscripts(videoId);

        //save transcripts to database
        const { data: newTranscripts, error: saveError } = await supabase
            .from("transcript")
            .insert([
                {
                    video_id: videoId,
                    transcript: JSON.stringify(transcripts),
                    user_id: user.id,
                }
            ])
            .select()
            .single();

        if (saveError) {
            return {
                success: false,
                error: "Error saving transcripts"
            }
        }

        return {
            success: true,
            data: newTranscripts
        }



    } catch (error) {
        console.error("Error fetching transcripts:", error);
        return {
            success: false,
            error: "An error occurred while fetching the transcripts"
        }
    }
}