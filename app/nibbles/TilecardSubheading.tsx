import React from "react";
import { theme } from "@/common/theme";
import { getDisplayTime } from "./timeUtils";

export type TilecardSubheadingProps = {
  timeTakenMinutes: number;
};

const TilecardSubheading: React.FC<TilecardSubheadingProps> = ({
  timeTakenMinutes,
}) => (
  <>
    <p
      className={`text-lg sm:text-xl md:text-3xl sm:mb-2 md:mb-3 ${theme.layout.tilecard.textPadding} ${theme.colours.tertiary.text}`}
    >
      {getDisplayTime(timeTakenMinutes)}
    </p>
  </>
);
export default TilecardSubheading;
