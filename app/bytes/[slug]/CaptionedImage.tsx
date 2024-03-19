import { TERTIARY_COLOUR_TEXT } from "@/common/theme";
import React from "react";

export type CaptionedImageProps = {
  image: string;
  caption: string
}

const CaptionedImage: React.FC<CaptionedImageProps> = (
  props: CaptionedImageProps
) => (
  <div className="my-7">
    <img
      src={props.image}
      alt={props.caption}
      className={`justify-self-center w-fit`}
    />
    <p className={`${TERTIARY_COLOUR_TEXT}`}>{props.caption}</p>
  </div>
);
export default CaptionedImage;
