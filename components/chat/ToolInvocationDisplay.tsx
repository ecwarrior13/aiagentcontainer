interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  result?: Record<string, unknown>;
}

interface ToolInvocationDisplayProps {
  toolInvocation: ToolInvocation;
}

export default function ToolInvocationDisplay({
  toolInvocation,
}: ToolInvocationDisplayProps) {
  return (
    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 space-y-2 text-gray-800 dark:text-gray-200">
      <div className="font-medium text-xs">
        🔧 Tool Used: {toolInvocation.toolName}
      </div>
      {toolInvocation.result && (
        <pre className="text-xs bg-white/75 dark:bg-gray-900/75 p-2 rounded overflow-auto max-h-40">
          {JSON.stringify(toolInvocation.result, null, 2)}
        </pre>
      )}
    </div>
  );
}
