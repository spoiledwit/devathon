import React from "react";
import ReactMarkdown from "react-markdown";

const MarkdownDisplay = ({ markdown }: { markdown: string }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
};

export default MarkdownDisplay;
