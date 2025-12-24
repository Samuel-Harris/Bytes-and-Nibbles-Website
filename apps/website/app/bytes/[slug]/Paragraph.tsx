import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

export type ParagraphProps = {
  value: string;
};

const Paragraph: React.FC<ParagraphProps> = ({ value }: ParagraphProps) => (
  <div className="mb-8 overflow-scroll">
    <ReactMarkdown remarkPlugins={[gfm]}>{value}</ReactMarkdown>
  </div>
);
export default Paragraph;
