import { TERTIARY_COLOUR_TEXT } from "@/common/theme";
import React from "react";

export type CaptionedImageProps = {
  image: string;
  caption: string;
};

const CaptionedImage: React.FC<CaptionedImageProps> = ({
  image,
  caption,
}: CaptionedImageProps) => (
  <div className="my-7">
    <img src={image} alt={caption} className={`justify-self-center w-fit`} />
    <p className={`${TERTIARY_COLOUR_TEXT}`}>{caption}</p>
  </div>
);
export default CaptionedImage;
