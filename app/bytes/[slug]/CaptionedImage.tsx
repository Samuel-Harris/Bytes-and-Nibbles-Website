import React from "react";
import theme from "@/app/utils/theme";

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
    <p className={`${theme.tertiaryColourText}`}>{props.caption}</p>
  </div>
);
export default CaptionedImage;
