// Generic entity reference (framework-agnostic)
export interface GenericEntityReference {
  id: string;
  path: string;
}

// CMS-specific content structure types (FireCMS internal format)
export interface Paragraph {
  paragraph: string; // Markdown content
}

export interface LatexParagraph {
  latexContent: string; // LaTeX content
}

export interface CaptionedImage {
  image: string;
  caption: string;
}

export interface Subsection {
  title: string;
  body: (Paragraph | LatexParagraph | CaptionedImage)[];
  isCollapsible?: boolean;
}

export interface Section {
  title: string;
  body: (Subsection | Paragraph | LatexParagraph | CaptionedImage)[];
  isCollapsible?: boolean;
}

// Byte type matching CMS schema
export interface Byte {
  title: string;
  subtitle: string;
  series: GenericEntityReference; // Generic entity reference
  slug: string;
  thumbnail: string;
  coverPhoto: string;
  isPublished: boolean; // Required in CMS
  publishDate: Date;
  lastModifiedDate: Date;
  sections: Section[];
}

// Website consumption types (transformed from CMS data)
export type ByteOverview = {
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
