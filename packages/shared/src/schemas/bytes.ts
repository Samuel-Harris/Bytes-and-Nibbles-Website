import {
  ByteType,
  SubsectionType,
  SubsubsectionType,
  SectionType,
  CaptionedImageType,
} from "../types/bytes";

// Constants for oneOf serialization types
export const SUBSECTION_BODY_ELEMENT_TYPES = {
  PARAGRAPH: "paragraph",
  LATEX_PARAGRAPH: "latexParagraph",
  CAPTIONED_IMAGE: "captionedImage",
  COLLAPSIBLE_GROUP: "collapsibleGroup",
  SUBSUBSECTION: "subsubsection",
} as const;

export const SECTION_BODY_ELEMENT_TYPES = {
  SUBSECTION: "subsection",
  PARAGRAPH: "paragraph",
  LATEX_PARAGRAPH: "latexParagraph",
  CAPTIONED_IMAGE: "captionedImage",
  COLLAPSIBLE_GROUP: "collapsibleGroup",
} as const;

// Discriminated shapes for polymorphic body fields (Firestore oneOf)
export type BaseContentSchema =
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

// Collapsible group schema
export interface CollapsibleGroupSchema {
  title?: string;
  body: BaseContentSchema[];
}

export type SubsubsectionBodyElementSchema =
  | BaseContentSchema
  | {
      type: typeof SUBSECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP;
      value: CollapsibleGroupSchema;
    };

export interface SubsubsectionSchema extends Omit<SubsubsectionType, "body"> {
  body: SubsubsectionBodyElementSchema[];
}

export type SubsectionBodyElementSchema =
  | {
      type: typeof SUBSECTION_BODY_ELEMENT_TYPES.SUBSUBSECTION;
      value: SubsubsectionSchema;
    }
  | SubsubsectionBodyElementSchema;

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
    }
  | {
      type: typeof SECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP;
      value: CollapsibleGroupSchema;
    };

export interface SectionSchema extends Omit<SectionType, "body"> {
  body: SectionBodyElementSchema[];
}

export interface ByteSchema extends Omit<ByteType, "sections"> {
  sections: SectionSchema[];
}
