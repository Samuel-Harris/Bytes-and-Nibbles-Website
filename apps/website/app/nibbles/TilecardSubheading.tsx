import React from "react";

import { getDisplayTime } from "@/common/timeUtils";

export type TilecardSubheadingProps = {
  timeTakenMinutes: number;
};

const TilecardSubheading: React.FC<TilecardSubheadingProps> = ({
  timeTakenMinutes,
}) => (
  <>
    <p
      className={`text-lg sm:text-xl md:text-3xl sm:mb-2 md:mb-3 pl-0 text-muted-foreground`}
    >
      {getDisplayTime(timeTakenMinutes)}
    </p>
  </>
);
export default TilecardSubheading;
