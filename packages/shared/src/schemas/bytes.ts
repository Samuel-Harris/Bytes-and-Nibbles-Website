import {
  ByteType,
  SubsectionType,
  SectionType,
  CaptionedImageType,
} from "../types/bytes";

// Constants for oneOf serialization types
export const SUBSECTION_BODY_ELEMENT_TYPES = {
  PARAGRAPH: "paragraph",
  LATEX_PARAGRAPH: "latexParagraph",
  CAPTIONED_IMAGE: "captionedImage",
} as const;

export const SECTION_BODY_ELEMENT_TYPES = {
  SUBSECTION: "subsection",
  PARAGRAPH: "paragraph",
  LATEX_PARAGRAPH: "latexParagraph",
  CAPTIONED_IMAGE: "captionedImage",
} as const;

// Schema types for oneOf serialization
export type SubsectionBodyElementSchema =
  | {
      type: typeof SUBSECTION_BODY_ELEMENT_TYPES.PARAGRAPH;
      value: string;
    }
  | {
      type: typeof SUBSECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH;
      value: string;
    }
  | {
      type: typeof SUBSECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE;
      value: CaptionedImageType;
    };

export interface SubsectionSchema extends Omit<SubsectionType, "body"> {
  body: SubsectionBodyElementSchema[];
}

export type SectionBodyElementSchema =
  | {
      type: typeof SECTION_BODY_ELEMENT_TYPES.SUBSECTION;
      value: SubsectionSchema;
    }
  | { type: typeof SECTION_BODY_ELEMENT_TYPES.PARAGRAPH; value: string }
  | {
      type: typeof SECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH;
      value: string;
    }
  | {
      type: typeof SECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE;
      value: CaptionedImageType;
    };

export interface SectionSchema extends Omit<SectionType, "body"> {
  body: SectionBodyElementSchema[];
}

export interface ByteSchema extends Omit<ByteType, "sections"> {
  sections: SectionSchema[];
}
