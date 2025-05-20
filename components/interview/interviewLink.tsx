import { getInterview } from "@/actions/interview/getInterview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InterviewDetails } from "@/types/interviewTypes";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  List,
  Mail,
  MessageCircle,
  Plus,
  Slack,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface InterviewLinkProps {
  interview_id: string;
}

function InterviewLink({ interview_id }: InterviewLinkProps) {
  const [formData, setFormData] = useState<InterviewDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const url =
    process.env.NEXT_PUBLIC_HOST_URL + `interview/${interview_id}/dialog`;

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

  return (
    <div className="flex flex-col items-center justify-center">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading interview details...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-red-500">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <Image
            src={"/robot_check.png"}
            alt="check"
            width={200}
            height={200}
            className="w-[100px] h-[100px]"
          ></Image>
          <h2 className="text-2xl font-medium mb-4">
            Your AI Interview is Ready
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Share the link below with your interviewer to start the interview.
          </p>
          <div className="w-full p-7 mt-4 rounded-lg bg-white">
            <div className="flex justify-between w-full">
              <h2 className="font-medium text-primary">Interview Link</h2>
              <h2 className="font-medium p-1 px-2 text-primary">
                Valid for 30 Days
              </h2>
            </div>
            <div className="flex gap-2 items-center">
              <Input defaultValue={getInterviewLink()} disabled={true} />

              <Button onClick={() => onCopyLink()}>
                <Copy />
                Copy Link
              </Button>
            </div>
            <hr className="my-7" />
            <div className="flex gap-4">
              <h2 className="text-sm text-gray-500 flex gap-2 items-center">
                <Clock className="w-4 h-4" /> {formData?.duration} Minutes
              </h2>
              <h2 className="text-sm text-gray-500 flex gap-2 items-center">
                <List className="w-4 h-4" />
                {formData?.questions.length || 0} Questions
              </h2>
              <h2 className="text-sm text-gray-500 flex gap-2 items-center">
                <Calendar className="w-4 h-4" /> Expires on 11/1/2025
              </h2>
            </div>
            <div className="mt-7 bg-white p-5 rounded-lg w-full">
              <h2 className="text-lg font-bold">Share Via</h2>
              <div className="flex gap-2 mt-4 justify-around">
                <Button variant={"outline"} className="">
                  <Mail />
                  Email
                </Button>
                <Button variant={"outline"} className="">
                  <Slack />
                  Slack
                </Button>
                <Button variant={"outline"} className="">
                  <MessageCircle />
                  Whatsapp
                </Button>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-4 justify-between w-full">
            <Link href={"/dashboard"}>
              <Button variant={"outline"} className="">
                {" "}
                <ArrowLeft />
                Back to Dashboard
              </Button>
            </Link>
            <Link href={"/agent/2?input=" + formData?.candidateName}>
              <Button>
                <Plus />
                Create New Interview
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
export default InterviewLink;
