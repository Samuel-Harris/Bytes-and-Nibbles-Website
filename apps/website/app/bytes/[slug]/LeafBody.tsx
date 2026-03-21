import React from "react";
import {
  SubsubsectionBodyElementSchema,
  getLatexText,
  getParagraphText,
} from "@bytes-and-nibbles/shared";
import Paragraph from "./Paragraph";
import CaptionedImage from "./CaptionedImage";
import LatexParagraph from "./LatexParagraph";
import CollapsibleGroup from "./CollapsibleGroup";

function assertNever(value: never): never {
  throw new Error(`Unhandled leaf body element: ${JSON.stringify(value)}`);
}

const LeafBody: React.FC<{ body: SubsubsectionBodyElementSchema[] }> = ({
  body,
}: {
  body: SubsubsectionBodyElementSchema[];
}) =>
  body.map((bodyElement: SubsubsectionBodyElementSchema, index: number) => {
    switch (bodyElement.type) {
      case "paragraph":
        return (
          <Paragraph
            value={getParagraphText(bodyElement.value)}
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
            value={getLatexText(bodyElement.value)}
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
      default: {
        const _exhaustive: never = bodyElement;
        return assertNever(_exhaustive);
      }
    }
  });

export default LeafBody;
