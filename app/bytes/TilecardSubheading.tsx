import React from "react";
import { Series } from "@/common/Byte";
import { theme } from "@/common/theme";

export type TilecardSubheadingProps = {
  subtitle: string;
  series: Series;
};

const TilecardSubheading: React.FC<TilecardSubheadingProps> = ({
  subtitle,
  series,
}) => (
  <>
    <p
      className={`text-lg sm:text-xl md:text-3xl sm:mb-2 md:mb-3 ${theme.layout.tilecard.textPadding} ${theme.colours.tertiary.text}`}
    >
      {subtitle}
    </p>
    <p
      style={{ backgroundColor: series.accentColour }} // cannot be set in tailwind as this is dynamically generated
      className={`text-white text-sm md:text-base inline-flex rounded-full mx-3 px-2 py-1 sm:mb-2 md:mb-3 font-medium ring-1 ring-inset ring-slate-500`}
    >
      {series.title}
    </p>
  </>
);
export default TilecardSubheading;
