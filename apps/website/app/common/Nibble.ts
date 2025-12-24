export type NibbleOverview = {
  title: string;
  thumbnail: string;
  coverPhoto: string;
  slug: string;
  publishDate: Date;
  timeTakenMinutes: number;
};

export type Ingredient = {
  name: string;
  quantity: number;
  measurement: string;
  optional: boolean;
};

export type Nibble = {
  title: string;
  thumbnail: string;
  coverPhoto: string;
  slug: string;
  source: string;
  nServings: number;
  ingredients: Ingredient[];
  steps: string[];
  publishDate: Date;
  lastModifiedDate: Date;
  timeTakenMinutes: number;
};
