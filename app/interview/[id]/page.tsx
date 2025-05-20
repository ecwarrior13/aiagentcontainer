"use client";
import InterviewLink from "@/components/interview/interviewLink";
import { useParams } from "next/navigation";
import React from "react";

function InterviewPage() {
  const params = useParams();
  const interviewId = params.id as string;

  return (
    <div>
      <InterviewLink interview_id={interviewId} />
    </div>
  );
}

export default InterviewPage;
