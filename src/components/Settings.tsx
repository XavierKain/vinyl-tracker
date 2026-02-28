import { useState } from 'react';
import { db } from '../db';
import { sampleRecords } from '../sampleData';

interface Props {
  recordCount: number;
  onRefresh: () => Promise<void>;
}

export default function Settings({ recordCount, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadSampleData() {
    setLoading(true);
    setMessage(null);
    try {
      const now = new Date();
      const entries = sampleRecords.map((r) => ({
        ...r,
        createdAt: new Date(now.getTime() - Math.random() * 100000000),
        updatedAt: now,
      }));
      await db.records.bulkAdd(entries);
      await onRefresh();
      setMessage(`✓ ${sampleRecords.length} sample records added!`);
    } catch (e) {
      setMessage('Error loading sample data.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function clearAllData() {
    if (!confirm('Delete ALL records? This cannot be undone.')) return;
    setLoading(true);
    try {
      await db.records.clear();
      await onRefresh();
      setMessage('✓ All records deleted.');
    } catch (e) {
      setMessage('Error clearing data.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <p className="text-sm text-gray-500">
        {recordCount} record{recordCount !== 1 ? 's' : ''} in your collection.
      </p>

      <button
        onClick={loadSampleData}
        disabled={loading}
        className="flex w-full items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4 text-left transition hover:border-amber-500/40 disabled:opacity-50"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
          <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-white">Load Sample Collection</p>
          <p className="text-xs text-gray-500">Add 10 classic albums (Pink Floyd, Beatles, Nirvana…)</p>
        </div>
      </button>

      <button
        onClick={clearAllData}
        disabled={loading}
        className="flex w-full items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4 text-left transition hover:border-red-500/40 disabled:opacity-50"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
          <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-red-400">Clear All Data</p>
          <p className="text-xs text-gray-500">Delete every record from your collection</p>
        </div>
      </button>

      {message && (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-3 text-center text-sm text-gray-300">
          {message}
        </div>
      )}

      <p className="px-1 text-xs text-gray-600">
        ⚠ All data is stored locally on your device. Nothing is sent to any server.
      </p>
    </div>
  );
}
