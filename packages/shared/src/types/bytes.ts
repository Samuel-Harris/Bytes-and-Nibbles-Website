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

export type SubsectionBodyElementType =
  | ParagraphType
  | LatexParagraphType
  | CaptionedImageType;

export type SectionBodyElementType = SubsectionType | SubsectionBodyElementType;

export interface SubsectionType {
  title: string;
  body: SubsectionBodyElementType[];
  isCollapsible?: boolean;
}

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
