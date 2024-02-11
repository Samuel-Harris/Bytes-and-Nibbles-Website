export type ByteOverview = {
  title: string;
  subtitle: string;
  thumbnail: string;
  publishDate: Date;
  slug: string;
};

export interface Paragraph {
  type: "paragraph";
  value: string;
}

export interface Code {
  type: "code";
  language: string;
  code: string;
}

export interface CaptionedImage {
  type: "captionedImage";
  image: string;
  caption: string;
}

export interface Section {
  title: string;
  body: (Paragraph | Code | CaptionedImage)[];
}

export type Byte = {
  title: string;
  subtitle: string;
  slug: string;
  thumbnail: string;
  coverPhoto: string;
  publishDate: Date;
  lastModifiedDate: Date;
  sections: Section[];
};
