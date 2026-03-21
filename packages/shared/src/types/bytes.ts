import { ByteSeriesType } from "./byteSeries";

// CMS-specific content structure types (FireCMS internal format)
export interface ParagraphType {
  paragraph: string; // Markdown content
  isFinished: boolean;
}

export interface LatexParagraphType {
  latexContent: string; // LaTeX content
  isFinished: boolean;
}

export interface CaptionedImageType {
  image: string;
  caption: string;
  isFinished: boolean;
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
  isFinished: boolean;
}

export type SubsectionBodyElementType = BaseContentType | CollapsibleGroupType;

export interface SubsectionType {
  title: string;
  body: SubsectionBodyElementType[];
  isCollapsible?: boolean;
  isFinished: boolean;
}

export type SectionBodyElementType = SubsectionType | SubsectionBodyElementType;

export interface SectionType {
  title: string;
  body: SectionBodyElementType[];
  isCollapsible?: boolean;
  isFinished: boolean;
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
