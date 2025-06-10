import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";
import type { CSSProperties } from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Custom components for markdown rendering
const markdownComponents: Components = {
  // Code blocks with syntax highlighting
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={oneDark as { [key: string]: CSSProperties }}
        language={match[1]}
        PreTag="div"
        className="rounded-md !mt-2 !mb-2"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code
        className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  },

  // Tables
  table(props) {
    return (
      <div className="overflow-x-auto my-4">
        <table
          className="min-w-full border-collapse border border-gray-300 dark:border-gray-600"
          {...props}
        >
          {props.children}
        </table>
      </div>
    );
  },

  thead(props) {
    return (
      <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
        {props.children}
      </thead>
    );
  },

  th(props) {
    return (
      <th
        className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold"
        {...props}
      >
        {props.children}
      </th>
    );
  },

  td(props) {
    return (
      <td
        className="border border-gray-300 dark:border-gray-600 px-4 py-2"
        {...props}
      >
        {props.children}
      </td>
    );
  },

  // Lists
  ul(props) {
    return (
      <ul className="list-disc list-inside space-y-1 my-2 ml-4" {...props}>
        {props.children}
      </ul>
    );
  },

  ol(props) {
    return (
      <ol className="list-decimal list-inside space-y-1 my-2 ml-4" {...props}>
        {props.children}
      </ol>
    );
  },

  li(props) {
    return (
      <li className="leading-relaxed" {...props}>
        {props.children}
      </li>
    );
  },

  // Headings
  h1(props) {
    return (
      <h1
        className="text-2xl font-bold mt-6 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2"
        {...props}
      >
        {props.children}
      </h1>
    );
  },

  h2(props) {
    return (
      <h2 className="text-xl font-bold mt-5 mb-3" {...props}>
        {props.children}
      </h2>
    );
  },

  h3(props) {
    return (
      <h3 className="text-lg font-semibold mt-4 mb-2" {...props}>
        {props.children}
      </h3>
    );
  },

  // Paragraphs
  p(props) {
    return (
      <p className="mb-3 leading-relaxed" {...props}>
        {props.children}
      </p>
    );
  },

  // Blockquotes
  blockquote(props) {
    return (
      <blockquote
        className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-4 bg-gray-50 dark:bg-gray-800 italic"
        {...props}
      >
        {props.children}
      </blockquote>
    );
  },

  // Links
  a(props) {
    return (
      <a
        href={props.href}
        className="text-blue-600 dark:text-blue-400 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {props.children}
      </a>
    );
  },

  // Horizontal rule
  hr(props) {
    return (
      <hr className="my-6 border-gray-300 dark:border-gray-600" {...props} />
    );
  },

  // Strong/Bold
  strong(props) {
    return (
      <strong className="font-semibold" {...props}>
        {props.children}
      </strong>
    );
  },

  // Emphasis/Italic
  em(props) {
    return (
      <em className="italic" {...props}>
        {props.children}
      </em>
    );
  },
};

export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
