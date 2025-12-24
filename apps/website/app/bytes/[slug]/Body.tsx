import React from "react";
import {
  SubsectionBodyElementType,
} from "@bytes-and-nibbles/shared";
import Paragraph from "./Paragraph";
import CaptionedImage from "./CaptionedImage";

const Body: React.FC<{ body: SubsectionBodyElementType[] }> = ({
  body,
}: {
  body: SubsectionBodyElementType[];
}) =>
  body.map((bodyElement: SubsectionBodyElementType) => {
    switch (bodyElement.type) {
      case "paragraph":
        return <Paragraph value={bodyElement.value} key={bodyElement.value} />;
      case "captionedImage":
        return (
          <CaptionedImage
            image={bodyElement.value.image}
            caption={bodyElement.value.caption}
            key={bodyElement.value.caption}
          />
        );
    }
  });
export default Body;
