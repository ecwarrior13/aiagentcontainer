
import { Dumbbell, Globe, type LucideIcon, PhoneCall, UserRound } from "lucide-react"
export interface CardData {
    id: number;
    title: string;
    icon: LucideIcon;
    chatTitle: string;
    description: string;
    inputLabel: string;
    inputPlaceholder: string;
    inputValue: string;
    inputRequired: boolean;
}

export const cardData: CardData[] = [
    {
        id: 1,
        title: "YouTube Researcher",
        icon: Globe,
        chatTitle: "YouTube Researcher",
        description: "A system agent that researches YouTube videos and provides a summary of the video.",
        inputLabel: "YouTube Researcher",
        inputPlaceholder: "Enter a YouTube video URL",
        inputValue: "",
        inputRequired: true,
    },
    {
        id: 2,
        title: "AI Interviewer",
        icon: UserRound,
        chatTitle: "AI Interviewer",
        description: "A system agent that interviews a person and provides a feedback of the candidate.",
        inputLabel: "AI Interviewer",
        inputPlaceholder: "Enter a person's name",
        inputValue: "",
        inputRequired: true,
    },
    {
        id: 3,
        title: "AI Fitness Coach",
        icon: Dumbbell,
        chatTitle: "AI Fitness Coach",
        description: "A system agent that provides a fitness plan based on the user's goals.",
        inputLabel: "AI Fitness Coach",
        inputPlaceholder: "Enter your fitness goals",
        inputValue: "",
        inputRequired: true,
    },
    {
        id: 4,
        title: "AI Sales Agent",
        icon: PhoneCall,
        chatTitle: "AI Sales Agent",
        description: "A system agent that sells a product to a customer.",
        inputLabel: "AI Sales Agent",
        inputPlaceholder: "Enter the field of the product you want to sell",
        inputValue: "",
        inputRequired: true,
    },
    {
        id: 5,
        title: "X Researcher",
        icon: Globe,
        chatTitle: "AI X Researcher",
        description: "A system agent that will research a topic and provide a summary of the information.",
        inputLabel: "AI X Researcher",
        inputPlaceholder: "Enter the destination you want to visit",
        inputValue: "",
        inputRequired: true,
    }
]