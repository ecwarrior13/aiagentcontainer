"use client";

import { getInterview } from "@/actions/interview/getInterview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { InterviewDetails } from "@/types/interviewTypes";
import { Phone, Timer, PhoneOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useVapiInterview } from "@/hooks/vapi-interview";
import { useInterviewTimer } from "@/components/interview/interviewTimer";
import { useInterviewFeedback } from "@/hooks/use-interview-feedback";
import { InterviewFeedback } from "@/components/interview/interviewFeedback";

export default function InterviewStartPage() {
  const params = useParams();
  const interview_id = String(params.id);

  const [formData, setFormData] = useState<InterviewDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Custom hooks
  const {
    elapsedTime,
    isRunning: isTimerRunning,
    startTimer,
    stopTimer,
    resetTimer,
    formatTime,
  } = useInterviewTimer();

  const {
    feedback,
    isGeneratingFeedback,
    feedbackError,
    generateFeedback,
    resetFeedback,
  } = useInterviewFeedback();

  const { isCallActive, isStarting, startCall, endCall, messages } =
    useVapiInterview({
      formData,
      onInterviewEnd: () => {
        stopTimer();
        // Additional cleanup logic here
      },
      onConversationEnd: async (conversationData) => {
        if (conversationData.length > 0) {
          setShowFeedback(true);
          await generateFeedback(conversationData, {
            candidateName: formData?.candidateName || "Candidate",
            jobPosition: formData?.jobPosition || "Job Position",
            userEmail: formData?.userEmail || "null",
            interview_id,
          });
        }
      },
    });

  // Fetch interview details
  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        setIsLoading(true);
        const result = await getInterview(interview_id);
        if (result.success && result.data) {
          setFormData(result.data);
        } else {
          setError(result.error || "Failed to fetch interview details");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Error fetching interview details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [interview_id]);

  const handleStartInterview = async () => {
    resetFeedback();
    setShowFeedback(false);
    const success = await startCall();
    if (success) {
      startTimer();
    }
  };

  const handleEndInterview = async () => {
    await endCall();
    stopTimer();
  };
  const handleCloseFeedback = () => {
    setShowFeedback(false);
  };

  // Function to get initials from name
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-gray-600">Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-center mb-4">
          <p className="text-xl font-medium">{error}</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const interviewStarted = isCallActive || isTimerRunning;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">
              Interview Session: {formData?.candidateName || "Candidate"}
            </h1>
            {interviewStarted && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Live
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
            <Timer className="w-4 h-4 text-gray-600" />
            <span className="font-mono">{formatTime()}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col">
          {/* Participants Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* AI Interviewer Card */}
            <Card className="p-6 flex flex-col items-center text-center">
              <div className="w-32 h-32 relative mb-4">
                <Image
                  src="/aisemble_transparent.png"
                  alt="AI Interviewer"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-lg font-medium">AI Interviewer</h2>
              <p className="text-sm text-gray-500 mt-1">
                {formData?.jobPosition
                  ? `${formData.jobPosition} Expert`
                  : "Interview Assistant"}
              </p>
              {isCallActive && (
                <Badge className="mt-2 bg-green-100 text-green-800">
                  Speaking
                </Badge>
              )}
            </Card>

            {/* Candidate Card */}
            <Card className="p-6 flex flex-col items-center text-center">
              <Avatar className="w-32 h-32 border-2 border-primary/20">
                <AvatarImage
                  src="/placeholder.svg"
                  alt={formData?.candidateName || "Candidate"}
                />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {getInitials(formData?.candidateName || "Candidate")}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-medium mt-4">
                {formData?.candidateName || "Candidate"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Interviewee</p>
              {formData?.jobPosition && (
                <Badge variant="outline" className="mt-2">
                  {formData.jobPosition}
                </Badge>
              )}
            </Card>
          </div>

          {/* Interview Controls */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              {!interviewStarted ? (
                <div className="flex flex-col items-center">
                  <Button
                    onClick={handleStartInterview}
                    disabled={isStarting}
                    size="lg"
                    className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-200 shadow-lg disabled:opacity-50"
                  >
                    {isStarting ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <Phone className="h-6 w-6" />
                    )}
                  </Button>
                  <span className="mt-3 font-medium text-gray-700">
                    {isStarting ? "Starting..." : "Start Interview"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 font-medium">
                      Interview in progress
                    </span>
                  </div>
                  <Button
                    onClick={handleEndInterview}
                    size="lg"
                    variant="destructive"
                    className="h-14 w-14 rounded-full transition-all duration-200 shadow-lg"
                  >
                    <PhoneOff className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Interview Content */}
          {/* Interview Content or Feedback */}
          {showFeedback ? (
            <InterviewFeedback
              feedback={feedback}
              isLoading={isGeneratingFeedback}
              error={feedbackError}
              onClose={handleCloseFeedback}
            />
          ) : interviewStarted ? (
            <Card className="flex-1">
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-6 min-h-[300px]">
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-gray-500 italic text-center">
                      Interview in progress...
                      <br />
                      <span className="text-sm">
                        Speak clearly and wait for the AI to finish before
                        responding
                      </span>
                    </p>
                    <div className="text-xs text-gray-400 mt-4">
                      {messages.length > 0 &&
                        `${messages.length} messages exchanged`}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </main>
    </div>
  );
}
