import React from "react";
import { ByteSeriesType as Series } from "@bytes-and-nibbles/shared";

export type TilecardSubheadingProps = {
  subtitle: string;
  series: Series;
};

const TilecardSubheading: React.FC<TilecardSubheadingProps> = ({
  subtitle,
  series,
}) => (
  <div className="flex flex-col gap-2">
    <p className={`text-lg sm:text-xl md:text-3xl text-muted-foreground`}>
      {subtitle}
    </p>
    <div className="flex">
      <span
        style={{ backgroundColor: series.accentColour }}
        className={`text-white text-sm md:text-base inline-flex rounded-full px-3 py-1 font-medium ring-1 ring-inset ring-white/20`}
      >
        {series.title}
      </span>
    </div>
  </div>
);
export default TilecardSubheading;
