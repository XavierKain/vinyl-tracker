export type Format = 'LP' | 'EP' | '45' | '78' | '10"' | 'Box Set';

export type Condition = 'M' | 'NM' | 'VG+' | 'VG' | 'G+' | 'G' | 'F' | 'P';

export interface VinylRecord {
  id?: number;
  artist: string;
  album: string;
  year?: number;
  format: Format;
  condition: Condition;
  colorVariant?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  notes?: string;
  coverUrl?: string;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type View = 'collection' | 'add' | 'detail' | 'edit' | 'stats' | 'import-export' | 'settings';

export const FORMATS: Format[] = ['LP', 'EP', '45', '78', '10"', 'Box Set'];

export const CONDITIONS: Condition[] = ['M', 'NM', 'VG+', 'VG', 'G+', 'G', 'F', 'P'];

export const CONDITION_LABELS: Record<Condition, string> = {
  M: 'Mint',
  NM: 'Near Mint',
  'VG+': 'Very Good Plus',
  VG: 'Very Good',
  'G+': 'Good Plus',
  G: 'Good',
  F: 'Fair',
  P: 'Poor',
};
