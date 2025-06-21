export interface CallRecord {
    id: string
    leadName: string
    company: string
    phone: string
    status: "completed" | "scheduled" | "failed" | "in-progress"
    outcome: "meeting-scheduled" | "catalog-sent" | "follow-up" | "not-interested" | "no-answer"
    callDate: Date
    duration: number // in minutes
    notes: string
}

export interface Task {
    id: string
    leadName: string
    company: string
    type: "follow-up" | "callback" | "send-catalog" | "confirm-meeting"
    priority: "high" | "medium" | "low"
    dueDate: Date
    status: "pending" | "completed" | "overdue"
    notes: string
}

export interface Appointment {
    id: string
    leadName: string
    company: string
    date: Date
    duration: number
    type: "demo" | "consultation" | "follow-up"
    status: "scheduled" | "completed" | "cancelled"
}

export const dashboardMetrics = {
    totalCalls: 247,
    callsToday: 23,
    meetingsScheduled: 18,
    catalogsSent: 45,
    successRate: 25.5, // percentage
    avgCallDuration: 4.2, // minutes
    conversionRate: 7.3, // percentage
    activeLeads: 156,
}

export const recentCalls: CallRecord[] = [
    {
        id: "1",
        leadName: "Sarah Johnson",
        company: "TechCorp Inc.",
        phone: "+1 (555) 123-4567",
        status: "completed",
        outcome: "meeting-scheduled",
        callDate: new Date("2025-06-15T10:30:00"),
        duration: 6,
        notes: "Interested in enterprise solution. Scheduled demo for next week.",
    },
    {
        id: "2",
        leadName: "Mike Chen",
        company: "StartupXYZ",
        phone: "+1 (555) 234-5678",
        status: "completed",
        outcome: "catalog-sent",
        callDate: new Date("2025-06-15T11:15:00"),
        duration: 3,
        notes: "Requested product catalog. Will follow up in 3 days.",
    },
    {
        id: "3",
        leadName: "Emily Rodriguez",
        company: "Global Solutions",
        phone: "+1 (555) 345-6789",
        status: "completed",
        outcome: "follow-up",
        callDate: new Date("2025-06-15T14:20:00"),
        duration: 8,
        notes: "Decision maker not available. Scheduled callback for tomorrow.",
    },
    {
        id: "4",
        leadName: "David Park",
        company: "Innovation Labs",
        phone: "+1 (555) 456-7890",
        status: "failed",
        outcome: "no-answer",
        callDate: new Date("2025-06-15T15:45:00"),
        duration: 0,
        notes: "No answer. Will retry tomorrow.",
    },
    {
        id: "5",
        leadName: "Lisa Thompson",
        company: "Future Tech",
        phone: "+1 (555) 567-8901",
        status: "completed",
        outcome: "not-interested",
        callDate: new Date("2025-06-15T16:30:00"),
        duration: 2,
        notes: "Not interested at this time. Remove from active list.",
    },
]

export const upcomingTasks: Task[] = [
    {
        id: "1",
        leadName: "Sarah Johnson",
        company: "TechCorp Inc.",
        type: "confirm-meeting",
        priority: "high",
        dueDate: new Date("2025-06-16T09:00:00"),
        status: "pending",
        notes: "Confirm demo meeting scheduled for next week",
    },
    {
        id: "2",
        leadName: "Mike Chen",
        company: "StartupXYZ",
        type: "follow-up",
        priority: "medium",
        dueDate: new Date("2025-06-18T14:00:00"),
        status: "pending",
        notes: "Follow up on catalog sent",
    },
    {
        id: "3",
        leadName: "Emily Rodriguez",
        company: "Global Solutions",
        type: "callback",
        priority: "high",
        dueDate: new Date("2025-06-16T10:30:00"),
        status: "pending",
        notes: "Callback to speak with decision maker",
    },
    {
        id: "4",
        leadName: "David Park",
        company: "Innovation Labs",
        type: "callback",
        priority: "low",
        dueDate: new Date("2025-06-17T11:00:00"),
        status: "pending",
        notes: "Retry call - no answer yesterday",
    },
    {
        id: "5",
        leadName: "Robert Wilson",
        company: "Enterprise Corp",
        type: "send-catalog",
        priority: "medium",
        dueDate: new Date("2025-06-16T16:00:00"),
        status: "overdue",
        notes: "Send product catalog as requested",
    },
]

export const appointments: Appointment[] = [
    {
        id: "1",
        leadName: "Sarah Johnson",
        company: "TechCorp Inc.",
        date: new Date("2025-06-22T14:00:00"),
        duration: 60,
        type: "demo",
        status: "scheduled",
    },
    {
        id: "2",
        leadName: "Alex Morgan",
        company: "Digital Dynamics",
        date: new Date("2025-06-18T10:00:00"),
        duration: 30,
        type: "consultation",
        status: "scheduled",
    },
    {
        id: "3",
        leadName: "Jennifer Lee",
        company: "Smart Systems",
        date: new Date("2025-06-18T15:30:00"),
        duration: 45,
        type: "follow-up",
        status: "scheduled",
    },
    {
        id: "4",
        leadName: "Tom Anderson",
        company: "NextGen Solutions",
        date: new Date("2025-06-23T11:00:00"),
        duration: 60,
        type: "demo",
        status: "scheduled",
    },
]

export const callsChartData = [
    { date: "2025-06-08", calls: 32, meetings: 3, catalogs: 8 },
    { date: "2025-06-09", calls: 28, meetings: 2, catalogs: 6 },
    { date: "2025-06-10", calls: 35, meetings: 4, catalogs: 9 },
    { date: "2025-06-11", calls: 31, meetings: 3, catalogs: 7 },
    { date: "2025-06-12", calls: 29, meetings: 2, catalogs: 5 },
    { date: "2025-06-15", calls: 23, meetings: 4, catalogs: 6 },
]

export const callData = {
    person: {
        name: "Sarah Johnson",
        title: "VP of Marketing",
        company: "TechFlow Solutions",
        location: "San Francisco, CA",
        avatar: "/placeholder.svg?height=96&width=96",
        initials: "SJ",
        leadScore: 85,
    },
    aiAgent: {
        name: "Sofie AI",
        role: "Senior Sales Representative",
        model: "GPT-4 Turbo",
        avatar: "/placeholder.svg?height=96&width=96",
        initials: "AI",
        confidence: 92,
    },
    callInfo: {
        startTime: "2:30 PM PST",
        topic: "Enterprise Software Demo",
        stage: "Needs Assessment",
        duration: 0,
    },
    context: {
        discussionPoints: [
            "Current CRM limitations",
            "Team size and workflow",
            "Integration requirements",
            "Budget considerations",
        ],
        objections: ["Implementation timeline", "Training requirements", "Data migration concerns"],
        nextSteps: ["Technical demo scheduled", "Pricing proposal to follow", "Connect with IT team"],
    },
}