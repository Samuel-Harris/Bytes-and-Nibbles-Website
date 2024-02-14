import React from "react";
import { ParagraphType } from "@/app/utils/Byte";

const Paragraph: React.FC<ParagraphType> = (props: ParagraphType) => (
  <p className="text-lg">{props.value}</p>
);
export default Paragraph;
