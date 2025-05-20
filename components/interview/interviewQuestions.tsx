"use client";

import { Loader2Icon, Trash2, Plus, Info, Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { EditQuestionDialog } from "./editQuestionDialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { InterviewFormData, QuestionItem } from "@/types/interviewTypes";

interface InterviewQuestionsProps {
  questions: QuestionItem[];
  isLoading: boolean;
  setQuestions: (questions: QuestionItem[]) => void;
  formData?: InterviewFormData;
}

function InterviewQuestions({
  questions,
  isLoading,
  setQuestions,
  formData,
}: InterviewQuestionsProps) {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<
    QuestionItem | undefined
  >();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();

  // Function to delete a specific question by index
  const handleDeleteQuestion = (indexToDelete: number) => {
    setQuestions(questions.filter((_, index) => index !== indexToDelete));
  };

  // Function to add a new question
  const handleAddQuestion = (newQuestion: QuestionItem) => {
    if (isEditing && currentQuestion) {
      // Update existing question
      const updatedQuestions = [...questions];
      const index = questions.findIndex((q) => q === currentQuestion);
      if (index !== -1) {
        updatedQuestions[index] = newQuestion;
        setQuestions(updatedQuestions);
      }
    } else {
      // Add new question
      setQuestions([...questions, newQuestion]);
    }

    // Reset editing state
    setIsEditing(false);
    setCurrentQuestion(undefined);
  };

  // Function to open edit dialog for a question
  const handleEditQuestion = (question: QuestionItem) => {
    setCurrentQuestion(question);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  // Function to open add dialog
  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setCurrentQuestion(undefined);
    setIsDialogOpen(true);
  };

  //saving the interview questions and form data to the database
  const handleSaveInterview = async () => {
    setIsSaved(true);

    try {
      const supabase = await createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("User not authenticated");
        setIsSaved(false);
        return;
      }

      const interviewId = uuidv4();
      const { error } = await supabase
        .from("interview")
        .insert([
          {
            ...formData,
            questionList: questions,
            userEmail: user.email,
            interview_id: interviewId,
          },
        ])
        .select();

      if (error) {
        toast.error("Error saving interview:");
        setIsSaved(false);
        throw error;
      } else {
        toast.success("Interview saved successfully");
        setIsSaved(false);
        // Redirect after successful save
        router.push(`/interview/${interviewId}`);
      }
    } catch (error) {
      console.error("Error saving interview:", error);
      toast.error("Error saving interview:");
      setIsSaved(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Interview Questions</h1>

      {isLoading && (
        <div className="flex flex-col justify-center items-center h-full gap-2">
          <Loader2Icon className="w-10 h-10 animate-spin" />
          <div>
            <span className="sr-only">Loading...</span>
            <span>AI is generating questions...</span>
          </div>
        </div>
      )}

      {!isLoading && questions.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-full gap-4">
          <p className="text-gray-500">
            No questions generated yet. Fill out the form and click
            &quot;Generate Questions&quot;.
          </p>
          <Button
            onClick={handleOpenAddDialog}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Custom Question
          </Button>
        </div>
      ) : (
        !isLoading && (
          <div className="flex-1 overflow-auto">
            <ul className="space-y-4">
              {questions.map((question, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        <span className="text-gray-700 mr-2">
                          Q{index + 1}:
                        </span>
                        {question.question}
                      </div>

                      {/* Tags row */}
                      {(question.type || question.experience_level) && (
                        <div className="flex flex-wrap gap-2 mt-2 mb-2">
                          {question.type && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {question.type}
                            </Badge>
                          )}
                          {question.experience_level && (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              {question.experience_level}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Explanation with tooltip */}
                      {question.explanation && (
                        <div className="mt-2 text-sm text-gray-500">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-gray-500"
                                >
                                  <Info className="h-4 w-4 mr-1" />
                                  <span>Why ask this?</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm p-4">
                                <p>{question.explanation}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditQuestion(question)}
                        aria-label={`Edit question ${index + 1}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className=""
                        onClick={() => handleDeleteQuestion(index)}
                        aria-label={`Delete question ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      )}

      {questions.length > 0 && !isLoading && (
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={() => setQuestions([])}>
            Clear Questions
          </Button>
          <Button
            variant="outline"
            onClick={handleOpenAddDialog}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
          <Button
            className="cursor-pointer"
            disabled={isSaved}
            onClick={handleSaveInterview}
          >
            {isSaved ? (
              <>
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save and Create Interview Link"
            )}
          </Button>
        </div>
      )}

      <EditQuestionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddQuestion}
        initialValue={currentQuestion}
        isEditing={isEditing}
      />
    </div>
  );
}

export default InterviewQuestions;
