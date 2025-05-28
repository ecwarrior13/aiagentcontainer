"use client";

import { getYoutubeTranscripts } from "@/actions/youtube/getVideoTranscripts";
import { useCallback, useEffect, useState } from "react";

interface YoutubeTranscriptsProps {
  text: string;
  timestamp: string;
}

export default function YoutubeTranscripts({ videoId }: { videoId: string }) {
  const [transcript, setTranscripts] = useState<
    YoutubeTranscriptsProps[] | null
  >(null);

  const handleGenerateTranscription = useCallback(async (videoId: string) => {
    console.log("Generating transcription for videoId:", videoId);

    const result = await getYoutubeTranscripts(videoId);
    console.log("Transcript result:", result); // Debug log
    if (result.success) {
      setTranscripts(result.data);
    } else {
      console.error("Error getting transcript:", result.error);
    }
  }, []);

  useEffect(() => {
    handleGenerateTranscription(videoId);
  }, [handleGenerateTranscription, videoId]);

  return (
    <div className="border p-4 pb-0 rounded-xl gap-4 flex flex-col bg-white">
      <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto rounded-md p-4">
        {transcript ? (
          transcript.map((entry, index) => (
            <div className="flex gap-2" key={index}>
              <span className="text-sm text-gray-400 min-w-[50px]">
                {entry.timestamp}
              </span>
              <span className="text-sm">{entry.text}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No transcription available.</p>
        )}
      </div>
    </div>
  );
}
