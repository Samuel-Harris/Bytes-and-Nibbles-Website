// Nibble-related types
export interface IngredientType {
  name: string;
  quantity: number;
  measurement: string;
  optional: boolean;
}

// Base content types (website consumption)
export type NibbleOverviewType = {
  title: string;
  thumbnail: string;
  coverPhoto: string;
  slug: string;
  publishDate: Date;
  timeTakenMinutes: number;
};

// Full content types (CMS editing with publishing flags)
export interface NibbleType extends NibbleOverviewType {
  source: string;
  nServings: number;
  ingredients: IngredientType[];
  steps: string[];
  lastModifiedDate: Date;
  isPublished?: boolean;
}
