"use client";

import { useState } from "react";
import InterViewDetails from "@/components/interview/interviewDetails";
import InterviewQuestions from "@/components/interview/interviewQuestions";
import { InterviewFormData, QuestionItem } from "@/types/interviewTypes";

interface AiInterviewAgentContainerProps {
  inputValue: string;
}

function AiInterviewAgentContainer({
  inputValue,
}: AiInterviewAgentContainerProps) {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<InterviewFormData | undefined>();

  const handleQuestionsGenerated = (
    generatedQuestions: QuestionItem[],
    data: InterviewFormData
  ) => {
    setQuestions(generatedQuestions);
    setFormData(data);
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Left side */}
      <div className="order-1 flex flex-col gap-4 border-gray-200 bg-white p-6 lg:order-1 lg:border-r">
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4">
          <h1 className="text-2xl font-bold">AI Interviewer</h1>
          <p className="text-gray-600">
            Create a mock interview for: {inputValue}
          </p>
          <InterViewDetails
            onQuestionsGenerated={handleQuestionsGenerated}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
      {/* Right Side */}
      <div className="order-2 h-[500px] bg-white md:h-[calc(100vh-6rem)] lg:sticky lg:top-20 lg:order-2">
        <InterviewQuestions
          questions={questions}
          isLoading={isLoading}
          setQuestions={setQuestions}
          formData={formData}
        />
      </div>
    </div>
  );
}

export default AiInterviewAgentContainer;
