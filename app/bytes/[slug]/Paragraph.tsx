import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

export type ParagraphProps = {
  value: string;
};

const Paragraph: React.FC<ParagraphProps> = (props: ParagraphProps) => (
  <ReactMarkdown className="whitespace-pre-wrap" remarkPlugins={[gfm]}>{props.value}</ReactMarkdown>
);
export default Paragraph;
