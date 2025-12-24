// Generic entity reference (framework-agnostic)
export interface GenericEntityReferenceType {
  id: string;
  path: string;
}

// CMS-specific content structure types (FireCMS internal format)
export interface ParagraphType {
  paragraph: string; // Markdown content
}

export interface LatexParagraphType {
  latexContent: string; // LaTeX content
}

export interface CaptionedImageType {
  image: string;
  caption: string;
}

export type SubsectionBodyElementType =
  | ParagraphType
  | LatexParagraphType
  | CaptionedImageType;

export interface SubsectionType {
  title: string;
  body: SubsectionBodyElementType[];
  isCollapsible?: boolean;
}

export interface SectionType {
  title: string;
  body: (SubsectionType | SubsectionBodyElementType)[];
  isCollapsible?: boolean;
}

// Byte type matching CMS schema
export interface ByteType {
  title: string;
  subtitle: string;
  series: GenericEntityReferenceType; // Generic entity reference
  slug: string;
  thumbnail: string;
  coverPhoto: string;
  isPublished: boolean; // Required in CMS
  publishDate: Date;
  lastModifiedDate: Date;
  sections: SectionType[];
}

// Website consumption types (transformed from CMS data)
export type ByteOverviewType = {
  title: string;
  subtitle: string;
  series: {
    title: string;
    accentColour: string;
  };
  thumbnail: string;
  publishDate: Date;
  slug: string;
};
