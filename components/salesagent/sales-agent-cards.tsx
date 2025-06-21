"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Phone,
  Calendar,
  Send,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  Filter,
  Download,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  dashboardMetrics,
  upcomingTasks,
  appointments,
  type Task,
  type Appointment,
} from "@/config/sales-agent-data";
import Link from "next/link";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "scheduled":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "overdue":
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (
    priority: string
  ): "destructive" | "default" | "secondary" => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const todaysAppointments = appointments.filter(
    (apt) =>
      format(apt.date, "yyyy-MM-dd") ===
      format(selectedDate || new Date(), "yyyy-MM-dd")
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          AI Sales Agent Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Calls Today
            </CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardMetrics.callsToday}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardMetrics.totalCalls} total this month
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Link href="/calls/live">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 whitespace-nowrap"
                >
                  🔴 Listen Live
                </Button>
              </Link>
              <Link href="/calls">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 whitespace-nowrap"
                >
                  View All Calls
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Meetings Scheduled
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardMetrics.meetingsScheduled}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardMetrics.conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catalogs Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardMetrics.catalogsSent}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg {dashboardMetrics.avgCallDuration}min call duration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardMetrics.successRate}%
            </div>
            <Progress value={dashboardMetrics.successRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {/* Tasks Section */}
        <Card>
          <CardHeader>
            <CardTitle>Follow-up Tasks</CardTitle>
            <CardDescription>
              Manage your upcoming follow-ups and callbacks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingTasks.map((task: Task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{task.leadName}</div>
                        <div className="text-sm text-muted-foreground">
                          {task.company}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {task.type.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(task.dueDate, "MMM dd, yyyy")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(task.dueDate, "h:mm a")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <span className="text-sm capitalize">
                          {task.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                          <DropdownMenuItem>Edit Task</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Calendar Section */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments Calendar</CardTitle>
            <CardDescription>Scheduled meetings and follow-ups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">
                  {selectedDate
                    ? format(selectedDate, "MMMM dd, yyyy")
                    : "Today's"}{" "}
                  Appointments
                </h4>
                {todaysAppointments.length > 0 ? (
                  <div className="space-y-2">
                    {todaysAppointments.map((appointment: Appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-2 border rounded-lg bg-white"
                      >
                        <div>
                          <div className="font-medium text-sm">
                            {appointment.leadName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {appointment.company}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(appointment.date, "h:mm a")} •{" "}
                            {appointment.duration}min
                          </div>
                        </div>
                        <Badge variant="default" className="text-xs">
                          {appointment.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No appointments scheduled
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
