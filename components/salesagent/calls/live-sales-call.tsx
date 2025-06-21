"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { callData } from "@/config/sales-agent-data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Loader2 } from "lucide-react";
import { Timer } from "@/components/Timer";

import { useVapiInterview } from "@/hooks/vapi-interview";
import { toast } from "sonner";

export default function LiveCall() {
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(true);
  const [currentSpeaker, setCurrentSpeaker] = useState<"person" | "ai">(
    "person"
  );
  const [isSalesCallActive, setIsSalesCallActive] = useState(false);
  const [isInitiatingCall, setIsInitiatingCall] = useState(false);
  const [callForm, setCallForm] = useState({
    companyName: "",
    contactName: "",
    phoneNumber: "",
  });

  // Simulate speaker switching
  useEffect(() => {
    const speakerTimer = setInterval(() => {
      setCurrentSpeaker((prev) => (prev === "person" ? "ai" : "person"));
    }, 4000);

    return () => clearInterval(speakerTimer);
  }, []);

  const {
    isRunning: isTimerRunning,
    startTimer,
    stopTimer,

    formatTime,
  } = Timer();

  const { isCallActive, isStarting, startCall, endCall, messages } =
    useVapiInterview({
      formData: callForm,
      onCallEnd: () => {
        stopTimer();
      },
      onConversationEnd: (messages) => {
        console.log("Conversation ended with messages:", messages);
      },
    });

  const handleAPICall = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    console.log("Starting API call with form data:", callForm);
    try {
      const response = await fetch("/api/calls/outbound", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ callForm }),
      });
      if (!response.ok) {
        throw new Error("Failed to initiate call");
      }
      const data = await response.json();
      console.log("API call response:", data);
    } catch (error) {
      console.error("Failed to initiate call:", error);
      toast.error("Failed to initiate call. Please try again.");
    }
  };

  const handleInitiateCall = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    console.log("Starting call with form data:", callForm);
    try {
      callData.person.name = callForm.contactName;
      callData.person.company = callForm.companyName;

      console.log("Starting call with form data:", callForm);
      const success = await startCall();
      if (success) {
        setIsInitiatingCall(true);
        setIsSalesCallActive(true);
        startTimer();
      }
      if (!success) {
        toast.error("Failed to initiate call. Please try again.");
      }
    } catch (error) {
      console.error("Failed to initiate call:", error);
      // Display error in toast and console
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to initiate call: ${errorMessage}`);
      console.error("Detailed error:", error);
    } finally {
      setIsInitiatingCall(false);
    }
  };

  const handleEndCall = async () => {
    try {
      await endCall();
      setIsSalesCallActive(false);
      setCallForm({
        companyName: "",
        contactName: "",
        phoneNumber: "",
      });

      console.log("Call ended successfully");
      stopTimer();
    } catch (error) {
      console.error("Failed to end call:", error);
      alert("Failed to end call. Please try again.");
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const callStarted = isCallActive || isTimerRunning;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Live Sales Call
          </h1>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Live Call
            </Badge>
            <Badge variant="outline">
              {/* Duration: {formatDuration(callDuration)} */}
              Duration: {formatTime()}
            </Badge>
          </div>
        </div>

        {/* Call Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Real Person */}
          <Card
            className={`transition-all duration-300 ${currentSpeaker === "person" ? "ring-2 ring-blue-500 shadow-lg" : ""}`}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={callData.person.avatar || "/placeholder.svg"}
                      alt={callData.person.name}
                    />
                    <AvatarFallback className="text-xl bg-blue-100 text-blue-700">
                      {callData.person.initials}
                    </AvatarFallback>
                  </Avatar>
                  {currentSpeaker === "person" && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {callData.person.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {callData.person.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {callData.person.company}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Status:</span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    Connected
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Location:</span>
                  <span className="text-slate-900">
                    {callData.person.location}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Lead Score:</span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    {callData.person.leadScore}/100
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Agent */}
          <Card
            className={`transition-all duration-300 ${currentSpeaker === "ai" ? "ring-2 ring-purple-500 shadow-lg" : ""}`}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={callData.aiAgent.avatar || "/placeholder.svg"}
                      alt={callData.aiAgent.name}
                    />
                    <AvatarFallback className="text-xl bg-purple-100 text-purple-700">
                      {callData.aiAgent.initials}
                    </AvatarFallback>
                  </Avatar>
                  {currentSpeaker === "ai" && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {callData.aiAgent.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {callData.aiAgent.role}
                  </p>
                  <p className="text-xs text-slate-500">AI Sales Assistant</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Status:</span>
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800"
                  >
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Model:</span>
                  <span className="text-slate-900">
                    {callData.aiAgent.model}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Confidence:</span>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700"
                  >
                    {callData.aiAgent.confidence}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Conversation Context 
        <Card className="mt-6">
          <CardHeader>
            <h3 className="text-lg font-semibold">Current Context</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">
                  Discussion Points
                </h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  {callData.context.discussionPoints.map((point, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-2">
                  Objections Raised
                </h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  {callData.context.objections.map((objection, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      <span>{objection}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Next Steps</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  {callData.context.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card> */}
        {/* Call Initiation Form */}
        {!isSalesCallActive ? (
          <Card className="mt-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">
                Initiate Outbound Sales Call
              </h3>
              <p className="text-sm">
                Enter the prospect details to start an AI-powered sales call
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInitiateCall} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="e.g., TechFlow Solutions"
                      value={callForm.companyName}
                      onChange={(e) =>
                        setCallForm((prev) => ({
                          ...prev,
                          companyName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Person</Label>
                    <Input
                      id="contactName"
                      type="text"
                      placeholder="e.g., Sarah Johnson"
                      value={callForm.contactName}
                      onChange={(e) =>
                        setCallForm((prev) => ({
                          ...prev,
                          contactName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="e.g., +1 (555) 123-4567"
                    value={callForm.phoneNumber}
                    onChange={(e) =>
                      setCallForm((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isInitiatingCall}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                  >
                    {isInitiatingCall ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Initiating Call...</span>
                      </>
                    ) : (
                      <>
                        <Phone className="w-5 h-5" />
                        <span>Start AI Sales Call</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Current Call Context</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">
                    Call Details
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span>Company: {callForm.companyName}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span>Contact: {callForm.contactName}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span>Phone: {callForm.phoneNumber}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">
                    Discussion Points
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {callData.context.discussionPoints.map((point, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">
                    Call Status
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span>Call in progress</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      <span>AI agent active</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Call Controls */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="lg"
                onClick={toggleMute}
                className="flex items-center space-x-2"
              >
                {isMuted ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
                <span>{isMuted ? "Unmute" : "Mute"}</span>
              </Button>

              <Button
                variant={isListening ? "outline" : "secondary"}
                size="lg"
                onClick={toggleListening}
                className="flex items-center space-x-2"
              >
                {isListening ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
                <span>{isListening ? "Listening" : "Paused"}</span>
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={handleEndCall}
                className="flex items-center space-x-2"
              >
                <PhoneOff className="w-5 h-5" />
                <span>End Call</span>
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 mb-2">Call Progress</p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <span className="text-slate-500">
                  Started: {callData.callInfo.startTime}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">
                  Topic: {callData.callInfo.topic}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">
                  Stage: {callData.callInfo.stage}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
