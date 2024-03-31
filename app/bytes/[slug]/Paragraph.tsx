import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

export type ParagraphProps = {
  value: string;
};

const Paragraph: React.FC<ParagraphProps> = ({ value }: ParagraphProps) => (
  <ReactMarkdown className="whitespace-pre-wrap" remarkPlugins={[gfm]}>
    {value}
  </ReactMarkdown>
);
export default Paragraph;
