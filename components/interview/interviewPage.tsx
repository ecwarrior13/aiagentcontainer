"use client";

import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Loader2Icon, Mic, Phone, Timer } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";
import { assistantOptions } from "@/services/Constants";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { supabase } from "@/services/supabaseClient";
import { useParams } from "next/navigation";

function StartInterviewPage() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [vapi] = useState(() => new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY));
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const { interview_id } = useParams();

  useEffect(() => {
    // Set up event listeners for call state changes
    const handleCallEnd = () => {
      console.log("Call ended");
      setIsCallActive(false);
      // Generate feedback when call ends
      generateFeedback();
    };

    const handleError = (error) => {
      console.error("VAPI error:", error);
      setIsCallActive(false);
      toast.error("An error occurred with the call");
    };

    const handleMessage = (message) => {
      console.log("New message:", message);
      setConversation((prev) => [...prev, message]);
    };

    vapi.on("call-end", handleCallEnd);
    vapi.on("error", handleError);
    vapi.on("message", handleMessage);

    // Cleanup event listeners and stop any active calls
    return () => {
      console.log("Cleaning up VAPI instance");
      vapi.off("call-end", handleCallEnd);
      vapi.off("error", handleError);
      vapi.off("message", handleMessage);
      if (isCallActive) {
        try {
          vapi.stop();
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      }
    };
  }, [vapi, isCallActive]);

  const generateFeedback = async () => {
    try {
      setIsLoading(true);

      // Validate required information
      if (
        !interviewInfo?.userName ||
        !interviewInfo?.userEmail ||
        !interview_id
      ) {
        toast.error("Missing required information for feedback");
        return;
      }

      // Format the conversation for the API
      const formattedConversation = conversation.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await axios.post("/api/ai-feedback", {
        conversation: formattedConversation,
      });

      if (response.data && response.data.content) {
        const feedbackData = JSON.parse(response.data.content);

        // Save to database
        const { error } = await supabase
          .from("interview-feedback") // Using underscore instead of hyphen
          .insert([
            {
              userName: interviewInfo.userName,
              userEmail: interviewInfo.userEmail,
              interview_id: interview_id,
              feedback: feedbackData,
              recommended: false,
              created_at: new Date().toISOString(), // Add timestamp
            },
          ]);

        if (error) {
          console.error("Error saving feedback to database:", error);
          toast.error("Failed to save feedback to database");
          // Still set the feedback in state even if database save fails
          setFeedback(feedbackData.feedback);
          return;
        }

        setFeedback(feedbackData.feedback);
        toast.success("Feedback generated and saved successfully");
      }
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast.error("Failed to generate feedback");
    } finally {
      setIsLoading(false);
    }
  };

  const startCall = async () => {
    try {
      setIsLoading(true);
      // Create a deep copy of assistant options
      const assistant = JSON.parse(JSON.stringify(assistantOptions));

      // Format questions list
      const questionsToAsk = interviewInfo?.interviewData?.questionList
        ?.map((item) => item?.question)
        .filter(Boolean)
        .join(", ");

      if (!questionsToAsk) {
        throw new Error("No questions found for the interview");
      }

      if (
        !interviewInfo?.userName ||
        !interviewInfo?.interviewData?.jobPosition
      ) {
        throw new Error("Missing required interview information");
      }

      // Replace placeholders using a more robust method
      const replacePlaceholders = (text) => {
        return text
          .replace(/{{userName}}/g, interviewInfo.userName)
          .replace(/{{jobPosition}}/g, interviewInfo.interviewData.jobPosition)
          .replace(/{{questionList}}/g, questionsToAsk);
      };

      // Update first message
      assistant.firstMessage = replacePlaceholders(assistant.firstMessage);

      // Update system prompt
      assistant.model.messages[0].content = replacePlaceholders(
        assistant.model.messages[0].content
      );

      // Start the call with the updated assistant options
      await vapi.start(assistant);
      setIsCallActive(true);
    } catch (error) {
      console.error("Error starting call:", error);
      toast.error("Failed to start the interview. Please try again.");
      setIsCallActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCall = async () => {
    try {
      setIsLoading(true);
      if (isCallActive) {
        await vapi.stop();
        console.log("Call stopped successfully");
        // Generate feedback when call is manually stopped
        await generateFeedback();
      }
    } catch (error) {
      console.error("Error stopping call:", error);
      if (!error.message?.includes("Meeting has ended")) {
        toast.error("Error ending the call");
      }
    } finally {
      setIsCallActive(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-20 lg:px-48 xl:px-64">
      <h2 className="text-2xl font-bold flex justify-between">
        Interview Session
        <span className="flex items-center gap-2 text-gray-500">
          <Timer className="w-4 h-4" />
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <div className="p-20 mt-5 border border-gray-200 rounded-lg bg-secondary/50 flex flex-col items-center justify-center gap-5">
          <Image
            src={"/aisemble_transparent.png"}
            alt="interview image"
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
          <h2>AI Recruiter</h2>
        </div>
        <div className="p-20 mt-5 border border-gray-200 rounded-lg bg-secondary/50 flex flex-col items-center justify-center gap-5">
          <h2 className="text-2xl font-bold bg-white p-3 rounded-full px-5">
            {interviewInfo?.userName[0].toUpperCase()}
          </h2>
          <h2 className="text-2xl font-bold">{interviewInfo?.userName}</h2>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-4">
        {!isCallActive ? (
          <Button
            className="w-12 h-12 p-3 rounded-full bg-green-500 text-white cursor-pointer hover:bg-green-600"
            onClick={startCall}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2Icon className="w-6 h-6 animate-spin" />
            ) : (
              <Phone className="w-6 h-6" />
            )}
          </Button>
        ) : (
          <>
            <Mic className="w-12 h-12 p-3 rounded-full bg-secondary/50" />
            <Button
              className="w-12 h-12 p-3 rounded-full bg-red-500 text-white cursor-pointer hover:bg-red-600"
              onClick={stopCall}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2Icon className="w-6 h-6 animate-spin" />
              ) : (
                <Phone className="w-6 h-6" />
              )}
            </Button>
          </>
        )}
      </div>
      <h2 className="text-sm text-gray-500 text-center mt-4">
        {isLoading
          ? "Processing..."
          : isCallActive
            ? "Interview in progress..."
            : "Ready to start interview"}
      </h2>

      {/* Add feedback display section */}
      {feedback && (
        <div className="mt-8 p-6 border rounded-lg bg-white">
          <h3 className="text-xl font-bold mb-4">Interview Feedback</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Ratings:</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  Technical Skills: {feedback.rating.technicalSkills}/10
                </div>
                <div>Communication: {feedback.rating.communication}/10</div>
                <div>Problem Solving: {feedback.rating.problemSolving}/10</div>
                <div>Experience: {feedback.rating.experience}/10</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Summary:</h4>
              <p className="mt-2">{feedback.summary}</p>
            </div>
            <div>
              <h4 className="font-semibold">Recommendation:</h4>
              <p className="mt-2">{feedback.Recommendation}</p>
            </div>
            <div>
              <h4 className="font-semibold">Fit for Role:</h4>
              <p className="mt-2">{feedback.goodFit}</p>
            </div>
            <div>
              <h4 className="font-semibold">Best Question Answered:</h4>
              <p className="mt-2">{feedback.question.bestquestionanswered}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StartInterviewPage;
