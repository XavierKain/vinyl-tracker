import Dexie, { type Table } from 'dexie';
import type { VinylRecord } from './types';

class VinylDB extends Dexie {
  records!: Table<VinylRecord>;

  constructor() {
    super('vinylTracker');
    this.version(1).stores({
      records: '++id, artist, album, year, format, condition, createdAt',
    });
  }
}

export const db = new VinylDB();
