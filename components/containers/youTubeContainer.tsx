import React from "react";
import YoutubeVideoDetails from "../youtube/YoutubeVideoDetails";
import YoutubeTranscripts from "../youtube/YoutubeTranscripts";

interface YoutubeAgentContainerProps {
  inputValue?: string;
}

function YoutubeAgentContainer({ inputValue }: YoutubeAgentContainerProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Left side */}
      <div className="order-2 flex flex-col gap-4 border-gray-200 bg-white p-6 lg:order-1 lg:border-r">
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4">
          <h1>YouTube Container</h1>
          {!inputValue ? (
            <p className="text-gray-500">Please enter a YouTube video URL</p>
          ) : (
            <>
              <YoutubeVideoDetails videoId={inputValue} />
              <YoutubeTranscripts videoId={inputValue} />
            </>
          )}
        </div>
      </div>
      {/* Right Side */}
      <div className="order-1 h-[500px] bg-white md:h-[calc(100vh-6rem)] lg:sticky lg:top-20 lg:order-2"></div>
    </div>
  );
}

export default YoutubeAgentContainer;
