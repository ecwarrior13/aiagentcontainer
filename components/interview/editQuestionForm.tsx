"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { QuestionItem } from "@/actions/interview/generateQuestions";

interface EditQuestionFormProps {
  onSubmit: (question: QuestionItem) => void;
  onCancel: () => void;
  initialValue?: QuestionItem;
  isEditing?: boolean;
}

export function EditQuestionForm({
  onSubmit,
  onCancel,
  initialValue = {
    question: "",
    explanation: "",
    type: "",
    experience_level: "",
  },
  isEditing = false,
}: EditQuestionFormProps) {
  const [questionData, setQuestionData] = useState<QuestionItem>(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionData.question.trim()) return;

    setIsSubmitting(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      onSubmit(questionData);
      setIsSubmitting(false);
    }, 300);
  };

  const handleChange = (field: keyof QuestionItem, value: string) => {
    setQuestionData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="question" className="text-sm font-medium">
          Question
        </label>
        <Textarea
          id="question"
          value={questionData.question}
          onChange={(e) => handleChange("question", e.target.value)}
          placeholder="Enter your interview question here..."
          className="min-h-[120px]"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="explanation" className="text-sm font-medium">
          Explanation (Optional)
        </label>
        <Textarea
          id="explanation"
          value={questionData.explanation || ""}
          onChange={(e) => handleChange("explanation", e.target.value)}
          placeholder="Why is this question important? (Optional)"
          className="min-h-[80px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium">
            Question Type (Optional)
          </label>
          <Input
            id="type"
            value={questionData.type || ""}
            onChange={(e) => handleChange("type", e.target.value)}
            placeholder="e.g. Technical, Behavioral"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="experience_level" className="text-sm font-medium">
            Experience Level (Optional)
          </label>
          <Input
            id="experience_level"
            value={questionData.experience_level || ""}
            onChange={(e) => handleChange("experience_level", e.target.value)}
            placeholder="e.g. Entry, Mid, Senior"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!questionData.question.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : isEditing ? (
            "Update Question"
          ) : (
            "Add Question"
          )}
        </Button>
      </div>
    </form>
  );
}
