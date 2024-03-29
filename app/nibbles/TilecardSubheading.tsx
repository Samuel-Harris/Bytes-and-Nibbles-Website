import React from "react";
import { TERTIARY_COLOUR_TEXT, TILECARD_TEXT_PADDING } from "@/common/theme";

export type TilecardSubheadingProps = {
  timeTakenMinutes: number;
};

const TilecardSubheading: React.FC<
  TilecardSubheadingProps
> = ({ timeTakenMinutes }) => (
  <>
    <p
      className={`text-lg sm:text-xl md:text-3xl sm:mb-2 md:mb-3 ${TILECARD_TEXT_PADDING} ${TERTIARY_COLOUR_TEXT}`}
    >
      {timeTakenMinutes} minutes
    </p>
  </>
);
export default TilecardSubheading;
