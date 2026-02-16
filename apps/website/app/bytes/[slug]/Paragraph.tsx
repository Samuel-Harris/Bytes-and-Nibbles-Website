import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export type ParagraphProps = {
  value: string;
};

const Paragraph: React.FC<ParagraphProps> = ({ value }: ParagraphProps) => (
  <div className="mb-8">
    <ReactMarkdown
      remarkPlugins={[gfm]}
      components={{
        code({ node: _node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              language={match[1]}
              style={vscDarkPlus}
              PreTag="div"
              customStyle={{
                margin: "1.5rem 0",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
              }}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {value}
    </ReactMarkdown>
  </div>
);
export default Paragraph;
