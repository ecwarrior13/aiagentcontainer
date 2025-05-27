"use client";

import { getInterview } from "@/actions/interview/getInterview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { InterviewDetails } from "@/types/interviewTypes";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  List,
  Plus,
  Play,
  Info,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface InterviewLinkProps {
  interview_id: string;
}

function InterviewLink({ interview_id }: InterviewLinkProps) {
  const [formData, setFormData] = useState<InterviewDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const url =
    process.env.NEXT_PUBLIC_HOST_URL + `interview/${interview_id}/start`;

  const getInterviewLink = () => {
    return url;
  };

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

  const onCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const formatExpiryDate = () => {
    // Calculate expiry date (30 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    return expiryDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 w-full">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading interview details...</p>
        </div>
      ) : error ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-red-500 text-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-4"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p className="text-xl font-medium">{error}</p>
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative inline-block">
              {/* <div className="absolute -z-10 bg-primary/10 rounded-full w-24 h-24 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div> */}
              <Image
                src="/robot_check.png"
                alt="Interview Ready"
                width={120}
                height={120}
                className="relative z-10"
              />
            </div>
            <h1 className="text-3xl font-bold mt-6 mb-2">
              Your AI Interview is Ready
            </h1>
            <p className="text-primary max-w-md mx-auto">
              Share the link below with your candidate or start the interview
              yourself.
            </p>
          </div>

          <Card className="border-2 border-gray-100 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-primary text-xl">
                  Interview Link
                </CardTitle>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  Valid for 30 Days
                </Badge>
              </div>
              <CardDescription>
                Share this secure link to start the interview process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2 items-center">
                <Input
                  defaultValue={getInterviewLink()}
                  disabled={true}
                  className="font-mono text-sm bg-gray-50"
                />
                <Button onClick={onCopyLink} className="whitespace-nowrap">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">
                      {formData?.duration} Minutes
                    </p>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <List className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">
                      {formData?.questionList.length} Questions
                    </p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{formatExpiryDate()}</p>
                    <p className="text-xs text-gray-500">Expires on</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-shrink-0">
                      <Image
                        src="/bot_interview.png"
                        alt="Interview Bot"
                        width={80}
                        height={80}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="text-lg font-semibold">Interview</h3>
                      <p> {formData?.candidateName || "Candidate"}</p>
                      <h3 className="text-lg font-semibold">Job Position</h3>
                      <p> {formData?.jobPosition || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="lg:ml-auto lg:max-w-sm w-full">
                    <div className="p-3 bg-secondary/30 flex gap-4 rounded-lg">
                      <Info className="w-4 h-4 flex-shrink-0 mt-1" />
                      <div>
                        <h2 className="font-bold">Before you begin</h2>
                        <ul className="list-disc list-inside">
                          <li className="text-sm text-primary">
                            Ensure you have a stable internet connection{" "}
                          </li>
                          <li className="text-sm text-primary">
                            Test your camera and microphone
                          </li>
                          <li className="text-sm text-primary">
                            Find a quiet place for the interview
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link href={url} className="w-full">
                <Button
                  className="w-full py-6 text-lg group transition-all"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Start Interview
                </Button>
              </Link>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Link
                href={`/agent/2?input=${formData?.candidateName || ""}`}
                className="w-full sm:w-auto sm:ml-auto"
              >
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Interview
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

export default InterviewLink;
