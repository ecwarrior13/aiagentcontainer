"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cardData, type CardData } from "@/config/systemAgents";
import { useRouter } from "next/navigation";
import { getVideoIdFromUrl } from "@/lib/getVideoIdFromUrl";
import { toast } from "sonner";

export function DashboardCards() {
  const [cards, setCards] = useState<CardData[]>(cardData);
  const router = useRouter();

  const handleUrlChange = (id: number, value: string) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, inputValue: value } : card
      )
    );
  };

  const handleSubmit = (id: number) => {
    // Handle saving the card data
    const card = cards.find((c) => c.id === id);
    console.log(`Starting chat with ${card?.chatTitle}:`, card);
    // Here you would typically initiate a chat with the selected agent
    if (card?.id === 1) {
      const videoId = getVideoIdFromUrl(card?.inputValue || "");

      if (videoId) {
        router.push(`/agent/${id}?input=${videoId}`);
      } else {
        toast.error("Invalid YouTube URL");
      }
    } else {
      router.push(
        `/agent/${id}?input=${encodeURIComponent(card?.inputValue || "")}`
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.id} className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <div className="bg-primary/10 p-2 rounded-md">
              {<card.icon className="h-6 w-6" />}
            </div>
            <CardTitle>{card.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{card.description}</p>
            <div className="space-y-2">
              <Label htmlFor={`input-${card.id}`}>{card.inputLabel}</Label>
              <Input
                id={`input-${card.id}`}
                placeholder={card.inputPlaceholder}
                value={card.inputValue}
                onChange={(e) => handleUrlChange(card.id, e.target.value)}
                required={card.inputRequired}
                className="bg-white"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleSubmit(card.id)}
              disabled={card.inputRequired && !card.inputValue}
            >
              Start Chat
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
