"use client";
import AiAgentContainer from "@/components/agent/AiAgentContainer";
import YoutubeAgentContainer from "@/components/containers/youTubeContainer";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import AiInterviewAgentContainer from "@/components/containers/AiInterviewAgentContainer";
import AiFitnessAgentContainer from "@/components/containers/AiFitnessAgentContainer";

function AgentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState("");

  const agentId = Number(params.id);

  // Get any passed input value from URL params or localStorage
  useEffect(() => {
    // Check URL params first
    const urlInputValue = searchParams.get("input");
    if (urlInputValue) {
      setInputValue(urlInputValue);
    } else {
      // Check localStorage as fallback
      const storedInput = localStorage.getItem(`card-${agentId}-input`);
      if (storedInput) {
        setInputValue(storedInput);
      }
    }
  }, [agentId, searchParams]);

  const renderAgentContainer = () => {
    switch (agentId) {
      case 1:
        return <YoutubeAgentContainer inputValue={inputValue} />;
      case 2:
        return <AiInterviewAgentContainer inputValue={inputValue} />;
      case 3:
        return <AiFitnessAgentContainer inputValue={inputValue} />;
      case 4:
        return <AiAgentContainer />;
      default:
        // Fallback to a generic agent or error state
        return (
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold text-red-500">
              Agent not found
            </h2>
            <p className="mt-2">
              The requested agent ID ({agentId}) is not valid.
            </p>
          </div>
        );
    }
  };

  return <div>{renderAgentContainer()}</div>;
}

export default AgentPage;
