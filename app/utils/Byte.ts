export type ByteOverview = {
  title: string;
  subtitle: string;
  thumbnail: string;
  publishDate: Date;
};

export interface Paragraph {
  paragraph: string;
}

export interface Code {
  language: string;
  code: string;
}

export interface CaptionedImage {
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
