"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

import { useEffect, useState } from "react";
import {
  InterviewFormData,
  InterviewTypes,
  QuestionItem,
  InterviewTypeItem,
} from "@/types/interviewTypes";
//import { generateInterviewQuestions } from "@/actions/interview/generateQuestions";

interface InterViewDetailsProps {
  onQuestionsGenerated: (
    questions: QuestionItem[],
    formData: InterviewFormData
  ) => void;
  setIsLoading: (loading: boolean) => void;
}

function InterViewDetails({
  onQuestionsGenerated,
  setIsLoading,
}: InterViewDetailsProps) {
  const [interviewType, setInterviewType] = useState<string[]>([]);
  const [formData, setFormData] = useState<InterviewFormData>({
    jobPosition: "",
    jobDescription: "",
    duration: "",
    experience_level: "",
    type: [],
    candidateName: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      type: interviewType,
    }));
  }, [interviewType]);

  const AddInterviewType = (type: InterviewTypeItem) => {
    const isSelected = interviewType.includes(type.title);
    if (!isSelected) {
      setInterviewType((prev) => [...prev, type.title]);
    } else {
      setInterviewType((prev) => prev.filter((item) => item !== type.title));
    }
  };

  const onHandleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    setIsLoading(true);

    /*  using server client action
    try {
      const result = await generateInterviewQuestions(formData);

      if (result.success && result.questions.length > 0) {
        onQuestionsGenerated(result.questions, formData);
      } else {
        console.error("Failed to generate questions:", result.error);
        // Show error message
      }
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
      */

    //using api route
    try {
      const response = await fetch("/api/interview/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success && result.questions.length > 0) {
        onQuestionsGenerated(result.questions, formData);
      } else {
        console.error("Failed to generate questions:", result.error);
        // Show error message
      }
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 bg-secondary rounded-lg p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Full Name</h2>
          <Input
            className="bg-white"
            placeholder="John Smit"
            onChange={(event) =>
              onHandleInputChange("candidateName", event.target.value)
            }
          ></Input>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Job Position</h2>
          <Input
            className="bg-white"
            placeholder="e.g. Full Stack Developer"
            onChange={(event) =>
              onHandleInputChange("jobPosition", event.target.value)
            }
          ></Input>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Job Description</h2>
          <Textarea
            className="bg-white"
            placeholder="enter description here"
            onChange={(event) =>
              onHandleInputChange("jobDescription", event.target.value)
            }
          ></Textarea>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Interview Duration</h2>
          <Select
            onValueChange={(value) => onHandleInputChange("duration", value)}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 Min</SelectItem>
              <SelectItem value="10">10 Min</SelectItem>
              <SelectItem value="15">15 Min</SelectItem>
              <SelectItem value="30">30 Min</SelectItem>
              <SelectItem value="45">45 Min</SelectItem>
              <SelectItem value="60">60 Min</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Experience Level</h2>
          <Select
            onValueChange={(value) =>
              onHandleInputChange("experience_level", value)
            }
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry-level">Entry Level</SelectItem>
              <SelectItem value="mid-level">Mid Level</SelectItem>
              <SelectItem value="senior-level">Senior Level</SelectItem>
              <SelectItem value="expert">Subject Matter Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Interview Type</h2>
          <div className="flex gap-3 flex-wrap mt-2">
            {InterviewTypes.map((type, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 px-3 border border-gray-200 
                cursor-pointer rounded-md hover:bg-gray-50 transition-colors min-w-[120px] ${
                  interviewType.includes(type.title)
                    ? "bg-red-700 text-white hover:bg-red-600"
                    : "bg-white"
                }`}
                onClick={() => AddInterviewType(type)}
              >
                <type.icon className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{type.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-7 flex justify-end">
        <Button
          className="mt-4"
          onClick={handleGenerateQuestions}
          disabled={
            isGenerating ||
            !formData.jobPosition ||
            !formData.jobDescription ||
            !formData.duration ||
            !formData.experience_level ||
            formData.type.length === 0
          }
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate Questions <ArrowRight />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default InterViewDetails;
