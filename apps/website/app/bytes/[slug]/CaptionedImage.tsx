import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

export type CaptionedImageProps = {
  image: string;
  caption: string;
};

const CaptionedImage: React.FC<CaptionedImageProps> = ({
  image,
  caption,
}: CaptionedImageProps) => (
  <div className="my-7">
    <img
      src={image}
      alt={caption}
      className={`justify-self-center w-fit rounded-md shadow-sm`}
    />
    <div className="text-muted-foreground text-sm mt-2 text-center font-style: italic">
      <ReactMarkdown remarkPlugins={[gfm]}>{caption}</ReactMarkdown>
    </div>
  </div>
);
export default CaptionedImage;
