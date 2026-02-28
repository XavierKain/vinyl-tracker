import type { VinylRecord } from '../types';
import { CONDITION_LABELS } from '../types';

interface Props {
  record: VinylRecord;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export default function RecordDetail({ record, onEdit, onDelete, onBack }: Props) {
  return (
    <div className="p-4">
      <button onClick={onBack} className="mb-4 text-sm text-gray-400 hover:text-white">
        &larr; Back to collection
      </button>

      <div className="overflow-hidden rounded-xl bg-gray-800/80">
        {/* Cover placeholder */}
        <div className="flex h-48 items-center justify-center bg-gray-900">
          {record.coverUrl ? (
            <img
              src={record.coverUrl}
              alt={`${record.artist} - ${record.album}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <svg viewBox="0 0 100 100" className="h-24 w-24 text-gray-700">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="8" fill="currentColor" />
              <circle cx="50" cy="50" r="2" fill="#0a0a0a" />
            </svg>
          )}
        </div>

        <div className="space-y-4 p-5">
          <div>
            <h1 className="text-2xl font-bold text-white">{record.album}</h1>
            <p className="text-lg text-gray-400">{record.artist}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Year" value={record.year?.toString()} />
            <Field label="Format" value={record.format} />
            <Field
              label="Condition"
              value={`${record.condition} — ${CONDITION_LABELS[record.condition]}`}
            />
            <Field label="Color / Variant" value={record.colorVariant} />
            <Field
              label="Purchase Price"
              value={record.purchasePrice != null ? `$${record.purchasePrice.toFixed(2)}` : undefined}
            />
            <Field label="Purchase Date" value={record.purchaseDate} />
            <Field label="Barcode" value={record.barcode} />
          </div>

          {record.notes && (
            <div>
              <p className="text-xs font-medium text-gray-500">Notes</p>
              <p className="mt-1 text-sm text-gray-300">{record.notes}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onEdit}
              className="flex-1 rounded-lg bg-amber-600 py-2.5 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this record from your collection?')) onDelete();
              }}
              className="rounded-lg bg-red-900/50 px-6 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-900"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-0.5 text-sm text-white">{value}</p>
    </div>
  );
}
