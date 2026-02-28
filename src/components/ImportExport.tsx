import { useRef, useState } from 'react';
import type { VinylRecord, Format, Condition } from '../types';
import { FORMATS, CONDITIONS } from '../types';

interface Props {
  records: VinylRecord[];
  onImport: (records: Omit<VinylRecord, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<void>;
}

const CSV_HEADERS = [
  'Artist',
  'Album',
  'Year',
  'Format',
  'Condition',
  'Color/Variant',
  'Purchase Price',
  'Purchase Date',
  'Notes',
  'Barcode',
];

function escapeCSV(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }
  fields.push(current.trim());
  return fields;
}

export default function ImportExport({ records, onImport }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  function exportCSV() {
    const lines = [CSV_HEADERS.join(',')];
    for (const r of records) {
      lines.push(
        [
          escapeCSV(r.artist),
          escapeCSV(r.album),
          r.year?.toString() ?? '',
          r.format,
          r.condition,
          escapeCSV(r.colorVariant ?? ''),
          r.purchasePrice?.toString() ?? '',
          r.purchaseDate ?? '',
          escapeCSV(r.notes ?? ''),
          r.barcode ?? '',
        ].join(','),
      );
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vinyl-collection-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ text: `Exported ${records.length} records` });
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setMessage(null);
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) {
        setMessage({ text: 'CSV file is empty or has no data rows', error: true });
        return;
      }

      const parsed: Omit<VinylRecord, 'id' | 'createdAt' | 'updatedAt'>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const fields = parseCSVLine(lines[i]);
        const artist = fields[0] ?? '';
        const album = fields[1] ?? '';
        if (!artist || !album) continue;

        const format = (FORMATS.includes(fields[3] as Format) ? fields[3] : 'LP') as Format;
        const condition = (
          CONDITIONS.includes(fields[4] as Condition) ? fields[4] : 'VG'
        ) as Condition;
        const year = fields[2] ? parseInt(fields[2], 10) : undefined;

        parsed.push({
          artist,
          album,
          year: isNaN(year!) ? undefined : year,
          format,
          condition,
          colorVariant: fields[5] || undefined,
          purchasePrice: fields[6] ? parseFloat(fields[6]) : undefined,
          purchaseDate: fields[7] || undefined,
          notes: fields[8] || undefined,
          barcode: fields[9] || undefined,
        });
      }

      if (parsed.length === 0) {
        setMessage({ text: 'No valid records found in CSV', error: true });
        return;
      }

      await onImport(parsed);
      setMessage({ text: `Imported ${parsed.length} records` });
    } catch {
      setMessage({ text: 'Failed to parse CSV file', error: true });
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-lg font-bold text-white">Import / Export</h2>

      {/* Export */}
      <div className="rounded-xl bg-gray-800/80 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-300">Export Collection</h3>
        <p className="mb-3 text-xs text-gray-500">
          Download your entire collection as a CSV file
        </p>
        <button
          onClick={exportCSV}
          disabled={records.length === 0}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-40"
        >
          Export CSV ({records.length} records)
        </button>
      </div>

      {/* Import */}
      <div className="rounded-xl bg-gray-800/80 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-300">Import Records</h3>
        <p className="mb-1 text-xs text-gray-500">
          Import from a CSV file. Expected columns:
        </p>
        <p className="mb-3 text-xs font-mono text-gray-600">
          Artist, Album, Year, Format, Condition, Color/Variant, Purchase Price, Purchase Date,
          Notes, Barcode
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFile}
          className="hidden"
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={importing}
          className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 disabled:opacity-40"
        >
          {importing ? 'Importing...' : 'Choose CSV File'}
        </button>
      </div>

      {message && (
        <p className={`text-sm ${message.error ? 'text-red-400' : 'text-green-400'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
