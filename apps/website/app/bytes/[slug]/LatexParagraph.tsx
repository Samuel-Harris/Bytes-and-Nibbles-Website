import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

export type LatexParagraphProps = {
  value: string;
};

const LatexParagraph: React.FC<LatexParagraphProps> = ({
  value,
}: LatexParagraphProps) => (
  <div className="mb-8">
    <ReactMarkdown remarkPlugins={[gfm]}>{value}</ReactMarkdown>
  </div>
);
export default LatexParagraph;
