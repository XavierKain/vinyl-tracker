import { useState, useEffect, useCallback } from 'react';
import { db } from '../db';
import type { VinylRecord } from '../types';

export function useRecords() {
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const all = await db.records.orderBy('createdAt').reverse().toArray();
    setRecords(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addRecord = useCallback(
    async (record: Omit<VinylRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date();
      await db.records.add({ ...record, createdAt: now, updatedAt: now });
      await refresh();
    },
    [refresh],
  );

  const updateRecord = useCallback(
    async (id: number, changes: Partial<VinylRecord>) => {
      await db.records.update(id, { ...changes, updatedAt: new Date() });
      await refresh();
    },
    [refresh],
  );

  const deleteRecord = useCallback(
    async (id: number) => {
      await db.records.delete(id);
      await refresh();
    },
    [refresh],
  );

  const importRecords = useCallback(
    async (newRecords: Omit<VinylRecord, 'id' | 'createdAt' | 'updatedAt'>[]) => {
      const now = new Date();
      const withDates = newRecords.map((r) => ({ ...r, createdAt: now, updatedAt: now }));
      await db.records.bulkAdd(withDates);
      await refresh();
    },
    [refresh],
  );

  return { records, loading, addRecord, updateRecord, deleteRecord, importRecords, refresh };
}
