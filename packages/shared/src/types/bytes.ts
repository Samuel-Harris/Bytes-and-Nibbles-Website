import { ByteSeriesType } from "./byteSeries";

// CMS-specific content structure types (FireCMS internal format)
export interface ParagraphType {
  paragraph: string; // Markdown content
  /** Default false when omitted (legacy). */
  is_finished?: boolean;
}

export interface LatexParagraphType {
  latexContent: string; // LaTeX content
  /** Default false when omitted (legacy). */
  is_finished?: boolean;
}

export interface CaptionedImageType {
  image: string;
  caption: string;
  /** Default false when omitted (legacy). */
  is_finished?: boolean;
}

// Base blocks in subsection/subsubsection bodies and inside collapsible groups
export type BaseContentType =
  | ParagraphType
  | LatexParagraphType
  | CaptionedImageType;

// Collapsible group of base blocks (no nested subsubsection)
export interface CollapsibleGroupType {
  title?: string; // Optional heading for the collapsible section
  body: BaseContentType[];
  /** Default false when omitted (legacy). */
  is_finished?: boolean;
}

export type SubsubsectionBodyElementType = BaseContentType | CollapsibleGroupType;

export interface SubsubsectionType {
  title: string;
  body: SubsubsectionBodyElementType[];
  isCollapsible?: boolean;
  /** Default false when omitted (legacy). */
  is_finished?: boolean;
}

export type SubsectionBodyElementType =
  | SubsubsectionType
  | SubsubsectionBodyElementType;

export interface SubsectionType {
  title: string;
  body: SubsectionBodyElementType[];
  isCollapsible?: boolean;
  /** Default false when omitted (legacy). */
  is_finished?: boolean;
}

export type SectionBodyElementType = SubsectionType | SubsectionBodyElementType;

export interface SectionType {
  title: string;
  body: SectionBodyElementType[];
  isCollapsible?: boolean;
  /** Default false when omitted (legacy). */
  is_finished?: boolean;
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
