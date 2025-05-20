"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditQuestionForm } from "./editQuestionForm";
import type { QuestionItem } from "@/actions/interview/generateQuestions";

interface EditQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: QuestionItem) => void;
  initialValue?: QuestionItem;
  isEditing?: boolean;
}

export function EditQuestionDialog({
  isOpen,
  onClose,
  onSubmit,
  initialValue = {
    question: "",
    explanation: "",
    type: "",
    experience_level: "",
  },
  isEditing = false,
}: EditQuestionDialogProps) {
  const handleSubmit = (question: QuestionItem) => {
    onSubmit(question);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Question" : "Add Custom Question"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your interview question below."
              : "Add a custom interview question to your list."}
          </DialogDescription>
        </DialogHeader>
        <EditQuestionForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          initialValue={initialValue}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
}
