import type { VinylRecord, Condition } from '../types';

const conditionColor: Record<Condition, string> = {
  M: 'bg-green-600',
  NM: 'bg-emerald-600',
  'VG+': 'bg-teal-600',
  VG: 'bg-blue-600',
  'G+': 'bg-yellow-600',
  G: 'bg-orange-600',
  F: 'bg-red-600',
  P: 'bg-red-800',
};

interface Props {
  record: VinylRecord;
  onClick: () => void;
}

export default function RecordCard({ record, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col overflow-hidden rounded-xl bg-gray-800/80 text-left transition hover:bg-gray-700/80 hover:ring-1 hover:ring-amber-500/40"
    >
      <div className="flex aspect-square items-center justify-center bg-gray-900">
        {record.coverUrl ? (
          <img
            src={record.coverUrl}
            alt={`${record.artist} - ${record.album}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <svg viewBox="0 0 100 100" className="h-16 w-16 text-gray-700">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
            <circle cx="50" cy="50" r="2" fill="#0a0a0a" />
          </svg>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="truncate text-sm font-semibold text-white">{record.album}</p>
        <p className="truncate text-xs text-gray-400">{record.artist}</p>
        <div className="mt-auto flex items-center gap-2 pt-1">
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${conditionColor[record.condition]}`}
          >
            {record.condition}
          </span>
          <span className="text-[10px] text-gray-500">{record.format}</span>
          {record.year && <span className="text-[10px] text-gray-500">{record.year}</span>}
        </div>
      </div>
    </button>
  );
}
