import { CaptionedImageType } from "@/app/utils/Byte";
import { theme } from "@/app/utils/theme";

const CaptionedImage: React.FC<CaptionedImageType> = (
  props: CaptionedImageType
) => (
  <div className="my-7">
    <img
      src={props.value.image}
      alt={props.value.caption}
      className={`justify-self-center w-fit`}
    />
    <p className={`${theme.tertiaryColourText}`}>{props.value.caption}</p>
  </div>
);
export default CaptionedImage;
