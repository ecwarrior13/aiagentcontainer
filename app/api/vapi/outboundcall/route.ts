import { NextResponse } from "next/server";
import { VapiClient } from "@vapi-ai/server-sdk";

const vapi = new VapiClient({
    token: process.env.VAPI_API_KEY || "",
});

export async function POST(req: Request) {
    const assistantIdKey = process.env.VAPI_ASSISTANT_ID;
    const workFlowAssistant = process.env.VAPI_WORKFLOW_ID;
    const phoneNumberIdKey = process.env.VAPI_PHONE_NUMBER_ID;
    const { callForm } = await req.json();
    const { companyName, contactName, phoneNumber } = callForm;

    console.log("Received call request:", { companyName, contactName, phoneNumber });

    try {
        const call = await vapi.calls.create({
            assistantId: assistantIdKey,
            phoneNumberId: phoneNumberIdKey,
            customer: { number: phoneNumber },

        });

        console.log("Call initiated successfully:", call);

        // Extract the call ID from the response - handle both object and string responses
        const callId = typeof call === 'object' && call !== null && 'id' in call
            ? (call as { id: string }).id
            : call;



        return NextResponse.json({
            success: true,
            callId: callId,
            monitorUrl: call,
        });

    } catch (error) {
        console.error("Failed to initiate call:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to initiate call",
        }, { status: 500 });
    }
}