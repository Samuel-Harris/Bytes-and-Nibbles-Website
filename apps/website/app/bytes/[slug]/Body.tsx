import React from "react";
import { BodyType, CaptionedImageType, ParagraphType } from "@bytes-and-nibbles/shared";
import Paragraph from "./Paragraph";
import CaptionedImage from "./CaptionedImage";

const Body: React.FC<{ body: BodyType }> = ({ body }: { body: BodyType }) =>
  body.map((bodyComponent: ParagraphType | CaptionedImageType) => {
    switch (bodyComponent.type) {
      case "paragraph":
        return (
          <Paragraph value={bodyComponent.value} key={bodyComponent.value} />
        );
      case "captionedImage":
        return (
          <CaptionedImage
            image={bodyComponent.value.image}
            caption={bodyComponent.value.caption}
            key={bodyComponent.value.caption}
          />
        );
    }
  });
export default Body;
