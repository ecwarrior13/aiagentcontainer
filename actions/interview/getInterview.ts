"use server";
import { InterviewDetails } from "@/types/interviewTypes";
import { createClient } from "@/utils/supabase/server";

type InterviewResult = {
    success: boolean;
    error?: string;
    data?: InterviewDetails;
}


export async function getInterview(interviewId: string): Promise<InterviewResult> {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return {
                success: false,
                error: "User is not authenticated, please login"
            }
        }

        const { data: interview, error: interviewError } = await supabase
            .from("interview")
            .select("*")
            .eq("interview_id", interviewId)
            .single();

        if (interviewError) {
            return {
                success: false,
                error: "Error fetching interview details"
            }
        }

        if (!interview) {
            return {
                success: false,
                error: "Interview not found"
            }
        }

        return {
            success: true,
            data: interview
        }
    } catch (error) {
        console.error("Error fetching interview details:", error);
        return {
            success: false,
            error: "An error occurred while fetching the interview"
        }
    }
}