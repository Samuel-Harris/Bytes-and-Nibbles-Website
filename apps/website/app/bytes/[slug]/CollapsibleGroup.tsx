import React from "react";
import { CollapsibleGroupSchema } from "@bytes-and-nibbles/shared";
import Collapsible from "./Collapsible";
import Body from "./Body";

const CollapsibleGroup: React.FC<CollapsibleGroupSchema> = ({
  title,
  body,
}) => {
  return (
    <Collapsible
      title={title || "Details"}
      isCollapsible={true}
      titleClassName="text-lg font-semibold"
    >
      <Body body={body} />
    </Collapsible>
  );
};

export default CollapsibleGroup;
