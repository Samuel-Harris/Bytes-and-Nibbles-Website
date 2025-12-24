// Nibble-related types
export interface Ingredient {
  name: string;
  quantity: number;
  measurement: string;
  optional: boolean;
}

// Base content types (website consumption)
export type NibbleOverview = {
  title: string;
  thumbnail: string;
  coverPhoto: string;
  slug: string;
  publishDate: Date;
  timeTakenMinutes: number;
};

// Full content types (CMS editing with publishing flags)
export interface Nibble extends NibbleOverview {
  source: string;
  nServings: number;
  ingredients: Ingredient[];
  steps: string[];
  lastModifiedDate: Date;
  isPublished?: boolean;
}
