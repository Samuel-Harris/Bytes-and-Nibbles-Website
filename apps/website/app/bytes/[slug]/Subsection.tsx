import React from "react";
import { SubsectionType } from "@bytes-and-nibbles/shared";
import { TERTIARY_COLOUR_TEXT } from "@/common/theme";
import Body from "./Body";

const Subsection: React.FC<SubsectionType> = ({
  title,
  body,
}: SubsectionType) => (
  <div className="my-4">
    <p className={`text-xl mb-2 ${TERTIARY_COLOUR_TEXT}`}>{title}</p>
    <Body body={body} />
  </div>
);
export default Subsection;
