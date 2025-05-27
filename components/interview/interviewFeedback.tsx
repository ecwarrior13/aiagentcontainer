"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2 } from "lucide-react";

interface InterviewFeedbackProps {
  feedback: {
    rating: {
      technical: number;
      communication: number;
      problemSolving: number;
      experience: number;
    };
    summary: string;
    goodfit: string;
    question: {
      bestquestionanswered: string;
      highlightofanswer: string;
    };
    recommendation: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  onClose?: () => void;
}

export function InterviewFeedback({
  feedback,
  isLoading,
  error,
  onClose,
}: InterviewFeedbackProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div className="text-center">
              <h3 className="font-medium text-lg">
                Generating Interview Feedback
              </h3>
              <p className="text-gray-500 mt-1">This may take a minute...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-red-600">
            Error Generating Feedback
          </CardTitle>
          <CardDescription>
            We encountered a problem while analyzing the interview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!feedback) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Interview Feedback</CardTitle>
            <CardDescription>
              AI-generated assessment of your interview performance
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={`${
              feedback.rating.technical >= 8
                ? "bg-green-50 text-green-700 border-green-200"
                : feedback.rating.technical >= 6
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            Technical Score: {feedback.rating.technical}/10
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Overall Assessment</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {feedback.summary}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Performance Scores</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Technical Skills</p>
              <Progress
                value={feedback.rating.technical * 10}
                className="h-2"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Communication</p>
              <Progress
                value={feedback.rating.communication * 10}
                className="h-2"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Problem Solving</p>
              <Progress
                value={feedback.rating.problemSolving * 10}
                className="h-2"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Experience</p>
              <Progress
                value={feedback.rating.experience * 10}
                className="h-2"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Best Response
            </h3>
            <div className="space-y-2">
              <p className="font-medium text-sm">Question:</p>
              <p className="text-gray-700">
                {feedback.question.bestquestionanswered}
              </p>
              <p className="font-medium text-sm mt-2">Highlight:</p>
              <p className="text-gray-700">
                {feedback.question.highlightofanswer}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium mb-2">Overall Fit</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {feedback.goodfit}
            </p>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Recommendation</h3>
              <p className="text-gray-700">{feedback.recommendation}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onClose} className="w-full">
          Close Feedback
        </Button>
      </CardFooter>
    </Card>
  );
}
