import { ByteSeriesType } from "./byteSeries";

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

// Base content types that can appear in a subsection (non-collapsible)
export type BaseContentType =
  | ParagraphType
  | LatexParagraphType
  | CaptionedImageType;

// Collapsible group that can contain base content types
export interface CollapsibleGroupType {
  title?: string; // Optional heading for the collapsible section
  body: BaseContentType[];
}

export type SubsectionBodyElementType = BaseContentType | CollapsibleGroupType;

export interface SubsectionType {
  title: string;
  body: SubsectionBodyElementType[];
  isCollapsible?: boolean;
}

export type SectionBodyElementType = SubsectionType | SubsectionBodyElementType;

export interface SectionType {
  title: string;
  body: SectionBodyElementType[];
  isCollapsible?: boolean;
}

// Website consumption types (transformed from CMS data)
export type ByteOverviewType = {
  title: string;
  subtitle: string;
  series: ByteSeriesType;
  thumbnail: string;
  publishDate: Date;
  slug: string;
};

// Byte type matching CMS schema
export interface ByteType extends ByteOverviewType {
  coverPhoto: string;
  isPublished: boolean; // Required in CMS
  lastModifiedDate: Date;
  sections: SectionType[];
}
