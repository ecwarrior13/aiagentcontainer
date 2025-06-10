import MarkdownRenderer from "./MarkdownRenderer";
import ToolInvocationDisplay from "./ToolInvocationDisplay";

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  result?: Record<string, unknown>;
}

interface MessagePart {
  type: string;
  text?: string;
  toolInvocation?: ToolInvocation;
}

interface Message {
  id: string;
  role: "user" | "assistant" | "system" | "data";
  content: string;
  parts?: MessagePart[];
  toolInvocations?: ToolInvocation[];
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const hasToolInvocations =
    message.toolInvocations && message.toolInvocations.length > 0;

  const renderMessageContent = () => {
    if (message.parts && message.role === "assistant") {
      // AI message with parts
      return (
        <div className="space-y-3">
          {message.parts.map((part, i) => {
            if (part.type === "text") {
              return <MarkdownRenderer key={i} content={part.text || ""} />;
            }

            if (part.type === "tool-invocation" && part.toolInvocation) {
              return (
                <ToolInvocationDisplay
                  key={i}
                  toolInvocation={part.toolInvocation}
                />
              );
            }

            return null;
          })}
        </div>
      );
    }

    if (message.role === "assistant" && hasToolInvocations) {
      // AI message with separate toolInvocations array
      return (
        <div className="space-y-3">
          {message.content && <MarkdownRenderer content={message.content} />}
          {message.toolInvocations?.map((invocation, i) => (
            <ToolInvocationDisplay key={i} toolInvocation={invocation} />
          ))}
        </div>
      );
    }

    // User message or simple assistant message
    const className =
      message.role === "user" ? "prose-invert text-primary-foreground" : "";
    return <MarkdownRenderer content={message.content} className={className} />;
  };

  return (
    <div
      className={`flex gap-3 p-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`rounded-2xl px-4 py-2 max-w-4xl ${
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted border border-border"
        }`}
      >
        {renderMessageContent()}
      </div>
    </div>
  );
}
