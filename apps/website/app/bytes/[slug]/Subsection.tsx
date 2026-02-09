import React from "react";
import { SubsectionSchema } from "@bytes-and-nibbles/shared";

import Body from "./Body";

const Subsection: React.FC<SubsectionSchema> = ({
  title,
  body,
}: SubsectionSchema) => (
  <div className="my-6">
    <h3 className="text-xl font-semibold mb-3 text-muted-foreground">
      {title}
    </h3>
    <Body body={body} />
  </div>
);
export default Subsection;
