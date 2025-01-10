import React from "react";
import { BodyType } from "@/common/Byte";
import Paragraph from "./Paragraph";
import CaptionedImage from "./CaptionedImage";

const Body: React.FC<{ body: BodyType }> = ({
  body,
}: {
  body: BodyType;
}) =>
  React.Children.toArray(
    body.map((bodyComponent) => {
      switch (bodyComponent.type) {
        case "paragraph":
          return <Paragraph value={bodyComponent.value} />;
        case "captionedImage":
          return (
            <CaptionedImage
              image={bodyComponent.value.image}
              caption={bodyComponent.value.caption}
            />
          );
      }
    })
  );
export default Body;
