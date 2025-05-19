import React from "react";
import { BodyType } from "@/common/Byte";
import { theme } from "@/common/theme";
import Body from "./Body";

export type SubsectionProps = {
  title: string;
  body: BodyType;
};

const Subsection: React.FC<SubsectionProps> = ({
  title,
  body,
}: SubsectionProps) => (
  <div className="my-4">
    <p className={`text-xl mb-2 ${theme.colours.tertiary.text}`}>{title}</p>
    <Body body={body} />
  </div>
);
export default Subsection;
