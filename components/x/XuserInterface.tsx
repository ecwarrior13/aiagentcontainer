import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function XUserInterface() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [testMode, setTestMode] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };
  return (
    <div className="max-w-2xl mx-auto pt-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <svg viewBox="0 0 24 24">
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </g>
          </svg>

          <h1 className="text-3xl font-bold text-gray-900">Tweet Summarizer</h1>
        </div>
        <p className="text-gray-600">
          Enter a Twitter username to get an AI summary of their last 7 days of
          tweets
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Enter Twitter Username</CardTitle>
          <CardDescription>
            Enter the username without the @ symbol (e.g., &quot;elonmusk&quot;)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  @
                </span>
                <Input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-8"
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading || !username.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Summarize"
                )}
              </Button>
            </div>

            {/* Test Mode Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="testMode"
                checked={testMode}
                onChange={(e) => setTestMode(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <label htmlFor="testMode" className="text-sm text-gray-600">
                Test Mode (use mock data to avoid rate limits)
              </label>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default XUserInterface;
