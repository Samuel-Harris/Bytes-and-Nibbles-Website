import React from "react";
import { SubsectionBodyElementSchema } from "@bytes-and-nibbles/shared";
import LeafBody from "./LeafBody";
import Subsubsection from "./Subsubsection";

const Body: React.FC<{ body: SubsectionBodyElementSchema[] }> = ({
  body,
}: {
  body: SubsectionBodyElementSchema[];
}) =>
  body.map((bodyElement: SubsectionBodyElementSchema, index: number) => {
    if (bodyElement.type === "subsubsection") {
      return (
        <Subsubsection
          key={`subsubsection-${index}`}
          title={bodyElement.value.title}
          body={bodyElement.value.body}
          isCollapsible={bodyElement.value.isCollapsible}
        />
      );
    }
    return (
      <LeafBody
        key={`${bodyElement.type}-${index}`}
        body={[bodyElement]}
      />
    );
  });
export default Body;
