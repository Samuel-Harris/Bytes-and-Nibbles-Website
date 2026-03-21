import React from "react";
import { SubsubsectionBodyElementSchema } from "@bytes-and-nibbles/shared";
import Paragraph from "./Paragraph";
import CaptionedImage from "./CaptionedImage";
import LatexParagraph from "./LatexParagraph";
import CollapsibleGroup from "./CollapsibleGroup";

const LeafBody: React.FC<{ body: SubsubsectionBodyElementSchema[] }> = ({
  body,
}: {
  body: SubsubsectionBodyElementSchema[];
}) =>
  body.map(
    (bodyElement: SubsubsectionBodyElementSchema, index: number) => {
      switch (bodyElement.type) {
        case "paragraph":
          return (
            <Paragraph
              value={bodyElement.value}
              key={`${bodyElement.type}-${index}`}
            />
          );
        case "captionedImage":
          return (
            <CaptionedImage
              image={bodyElement.value.image}
              caption={bodyElement.value.caption}
              key={`${bodyElement.type}-${index}`}
            />
          );
        case "latexParagraph":
          return (
            <LatexParagraph
              value={bodyElement.value}
              key={`${bodyElement.type}-${index}`}
            />
          );
        case "collapsibleGroup":
          return (
            <CollapsibleGroup
              title={bodyElement.value.title}
              body={bodyElement.value.body}
              key={`${bodyElement.type}-${index}`}
            />
          );
      }
    },
  );

export default LeafBody;
