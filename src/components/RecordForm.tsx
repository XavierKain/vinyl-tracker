import { useState } from 'react';
import type { VinylRecord, Format, Condition } from '../types';
import { FORMATS, CONDITIONS, CONDITION_LABELS } from '../types';
import { useMusicBrainz } from '../hooks/useMusicBrainz';
import BarcodeScanner from './BarcodeScanner';

interface Props {
  initial?: VinylRecord;
  onSave: (data: Omit<VinylRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function RecordForm({ initial, onSave, onCancel }: Props) {
  const [artist, setArtist] = useState(initial?.artist ?? '');
  const [album, setAlbum] = useState(initial?.album ?? '');
  const [year, setYear] = useState(initial?.year?.toString() ?? '');
  const [format, setFormat] = useState<Format>(initial?.format ?? 'LP');
  const [condition, setCondition] = useState<Condition>(initial?.condition ?? 'VG+');
  const [colorVariant, setColorVariant] = useState(initial?.colorVariant ?? '');
  const [purchasePrice, setPurchasePrice] = useState(initial?.purchasePrice?.toString() ?? '');
  const [purchaseDate, setPurchaseDate] = useState(initial?.purchaseDate ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [barcode, setBarcode] = useState(initial?.barcode ?? '');
  const [scanning, setScanning] = useState(false);

  const { lookupBarcode, looking, error: mbError } = useMusicBrainz();

  async function handleBarcodeScan(code: string) {
    setScanning(false);
    setBarcode(code);
    const result = await lookupBarcode(code);
    if (result) {
      setArtist(result.artist);
      setAlbum(result.album);
      if (result.year) setYear(result.year.toString());
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      artist: artist.trim(),
      album: album.trim(),
      year: year ? parseInt(year, 10) : undefined,
      format,
      condition,
      colorVariant: colorVariant.trim() || undefined,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
      purchaseDate: purchaseDate || undefined,
      notes: notes.trim() || undefined,
      barcode: barcode.trim() || undefined,
    });
  }

  const inputClass =
    'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500';
  const labelClass = 'block text-xs font-medium text-gray-400 mb-1';

  return (
    <>
      {scanning && <BarcodeScanner onScan={handleBarcodeScan} onClose={() => setScanning(false)} />}
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {initial ? 'Edit Record' : 'Add Record'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        </div>

        {/* Barcode scanner */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className={labelClass}>Barcode</label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Enter or scan barcode"
              className={inputClass}
            />
          </div>
          <button
            type="button"
            onClick={() => setScanning(true)}
            className="mt-5 rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-500"
          >
            Scan
          </button>
          <button
            type="button"
            onClick={async () => {
              if (barcode.trim()) {
                const result = await lookupBarcode(barcode.trim());
                if (result) {
                  setArtist(result.artist);
                  setAlbum(result.album);
                  if (result.year) setYear(result.year.toString());
                }
              }
            }}
            disabled={looking || !barcode.trim()}
            className="mt-5 rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-600 disabled:opacity-40"
          >
            {looking ? '...' : 'Lookup'}
          </button>
        </div>
        {mbError && <p className="text-xs text-red-400">{mbError}</p>}

        {/* Core fields */}
        <div>
          <label className={labelClass}>Artist *</label>
          <input
            type="text"
            required
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Pink Floyd"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Album *</label>
          <input
            type="text"
            required
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            placeholder="The Dark Side of the Moon"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="1973"
              min="1900"
              max="2099"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as Format)}
              className={inputClass}
            >
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as Condition)}
              className={inputClass}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c} — {CONDITION_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Color / Variant</label>
          <input
            type="text"
            value={colorVariant}
            onChange={(e) => setColorVariant(e.target.value)}
            placeholder="Red splatter, 180g, etc."
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Purchase Price</label>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="25.00"
              step="0.01"
              min="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Purchase Date</label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Original pressing, signed, etc."
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={!artist.trim() || !album.trim()}
          className="w-full rounded-lg bg-amber-600 py-3 text-sm font-bold text-white hover:bg-amber-500 disabled:opacity-40"
        >
          {initial ? 'Save Changes' : 'Add to Collection'}
        </button>
      </form>
    </>
  );
}
