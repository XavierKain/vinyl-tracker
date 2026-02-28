import { useState, useMemo } from 'react';
import type { VinylRecord, Format, Condition } from '../types';
import { FORMATS, CONDITIONS } from '../types';
import RecordCard from './RecordCard';

interface Props {
  records: VinylRecord[];
  onSelect: (record: VinylRecord) => void;
}

export default function CollectionView({ records, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [filterFormat, setFilterFormat] = useState<Format | ''>('');
  const [filterCondition, setFilterCondition] = useState<Condition | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter((r) => {
      if (q && !r.artist.toLowerCase().includes(q) && !r.album.toLowerCase().includes(q))
        return false;
      if (filterFormat && r.format !== filterFormat) return false;
      if (filterCondition && r.condition !== filterCondition) return false;
      return true;
    });
  }, [records, search, filterFormat, filterCondition]);

  const selectClass =
    'rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none';

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search artist or album..."
          className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`rounded-lg border px-3 py-2 text-sm ${showFilters ? 'border-amber-500 bg-amber-600/20 text-amber-400' : 'border-gray-700 bg-gray-800 text-gray-400 hover:text-white'}`}
        >
          Filter
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex gap-2">
          <select
            value={filterFormat}
            onChange={(e) => setFilterFormat(e.target.value as Format | '')}
            className={selectClass}
          >
            <option value="">All formats</option>
            {FORMATS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value as Condition | '')}
            className={selectClass}
          >
            <option value="">All conditions</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-gray-500">
        {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        {filtered.length !== records.length && ` (of ${records.length})`}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          {records.length === 0 ? (
            <>
              <svg viewBox="0 0 100 100" className="mb-4 h-16 w-16 text-gray-700">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="8" fill="currentColor" />
              </svg>
              <p className="text-gray-400">No records yet</p>
              <p className="text-sm text-gray-600">Tap + to add your first vinyl</p>
            </>
          ) : (
            <p className="text-gray-400">No matches</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((r) => (
            <RecordCard key={r.id} record={r} onClick={() => onSelect(r)} />
          ))}
        </div>
      )}
    </div>
  );
}
