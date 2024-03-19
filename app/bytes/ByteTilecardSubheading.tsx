import { Series } from "@/common/Byte";
import { TERTIARY_COLOUR_TEXT, TILECARD_TEXT_PADDING } from "@/common/theme";

export type ByteTilecardSubheadingProps = {
  subtitle: string;
  series: Series;
};

export const ByteTilecardSubheading: React.FC<ByteTilecardSubheadingProps> = ({
  subtitle,
  series,
}) => (
  <>
    <p
      className={`text-lg sm:text-xl md:text-3xl sm:mb-2 md:mb-3 ${TILECARD_TEXT_PADDING} ${TERTIARY_COLOUR_TEXT}`}
    >
      {subtitle}
    </p>
    <p
      style={{ backgroundColor: series.accentColour }} // cannot be set in tailwind as this is dynamically generated
      className={`text-sm md:text-base inline-flex rounded-full mx-3 px-2 py-1 sm:mb-2 md:mb-3 font-medium ring-1 ring-inset ring-slate-500`}
    >
      {series.title}
    </p>
  </>
);
