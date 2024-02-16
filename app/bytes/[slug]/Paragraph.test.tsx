import React from "react";
import { render } from "@testing-library/react";
import Paragraph from "./Paragraph";
import { ParagraphType } from "@/utils/Byte";

describe("Byte paragraph", () => {
    it("should render the given paragraph", () => {
        const paragraph: ParagraphType = {type: "paragraph", value: "This is a paragraph"};

        render(<Paragraph value={paragraph.value}/>);

        expect(document.body.innerHTML).toContain(paragraph.value);
    })
});