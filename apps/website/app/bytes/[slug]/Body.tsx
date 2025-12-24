import React from "react";
import { SubsectionBodyElementSchema } from "@bytes-and-nibbles/shared";
import Paragraph from "./Paragraph";
import CaptionedImage from "./CaptionedImage";

const Body: React.FC<{ body: SubsectionBodyElementSchema[] }> = ({
  body,
}: {
  body: SubsectionBodyElementSchema[];
}) =>
  body.map((bodyElement: SubsectionBodyElementSchema) => {
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
