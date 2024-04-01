import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

export type ParagraphProps = {
  value: string;
};

const Paragraph: React.FC<ParagraphProps> = ({ value }: ParagraphProps) => (
  <ReactMarkdown className="mb-8" remarkPlugins={[gfm]}>
    {value}
  </ReactMarkdown>
);
export default Paragraph;
