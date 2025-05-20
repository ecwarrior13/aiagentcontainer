"use server";

import { google } from "googleapis";
import { VideoDetails } from "@/types/youtubeTypes";

const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
})

export async function getVideoDetails(videoId: string) {


    try {
        const videoResponse = await youtube.videos.list({
            part: ["snippet", "statistics"],
            id: [videoId],
        })

        const videoDetails = videoResponse.data.items?.[0];
        if (!videoDetails) {
            console.error(`Video not found for ID: ${videoId}`);
            return null;
        }

        //call for changnel details including tuumbnail
        const channelResponse = await youtube.channels.list({
            part: ["snippet", "statistics"],
            id: [videoDetails.snippet?.channelId || ""],
            key: process.env.YOUTUBE_API_KEY,
        })

        const channelDetails = channelResponse.data.items?.[0];


        const video: VideoDetails = {
            title: videoDetails.snippet?.title || "Unknown Title",
            thumbnail:
                videoDetails.snippet?.thumbnails?.maxres?.url ||
                videoDetails.snippet?.thumbnails?.high?.url ||
                videoDetails.snippet?.thumbnails?.default?.url ||
                "",
            publishedAt: videoDetails.snippet?.publishedAt || new Date().toISOString(),
            views: videoDetails.statistics?.viewCount || "0",
            likes: videoDetails.statistics?.likeCount || "Not Available",
            comments: videoDetails.statistics?.commentCount || "Not Available",
            channel: {
                title: videoDetails.snippet?.channelTitle || "Unknown Channel",
                thumbnail: channelDetails?.snippet?.thumbnails?.default?.url || "",
                subscribers: channelDetails?.statistics?.subscriberCount || "0",
            }
        }

        return video;


    } catch (error) {
        console.error("Error fetching video details: ", error);
        return null;
    }
}