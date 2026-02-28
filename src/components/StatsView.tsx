import type { VinylRecord } from '../types';
import { CONDITION_LABELS } from '../types';

interface Props {
  records: VinylRecord[];
}

export default function StatsView({ records }: Props) {
  const totalRecords = records.length;
  const totalValue = records.reduce((sum, r) => sum + (r.purchasePrice ?? 0), 0);
  const withPrice = records.filter((r) => r.purchasePrice != null);
  const avgPrice = withPrice.length > 0 ? totalValue / withPrice.length : 0;

  // Format breakdown
  const byFormat = new Map<string, number>();
  for (const r of records) {
    byFormat.set(r.format, (byFormat.get(r.format) ?? 0) + 1);
  }

  // Condition breakdown
  const byCondition = new Map<string, number>();
  for (const r of records) {
    byCondition.set(r.condition, (byCondition.get(r.condition) ?? 0) + 1);
  }

  // Top artists
  const byArtist = new Map<string, number>();
  for (const r of records) {
    byArtist.set(r.artist, (byArtist.get(r.artist) ?? 0) + 1);
  }
  const topArtists = [...byArtist.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

  if (totalRecords === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 py-20">
        <p className="text-gray-400">No records to show stats for</p>
        <p className="text-sm text-gray-600">Add some vinyl to your collection first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-lg font-bold text-white">Collection Stats</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total Records" value={totalRecords.toString()} />
        <StatCard label="Total Spent" value={`$${totalValue.toFixed(2)}`} />
        <StatCard label="Avg Price" value={`$${avgPrice.toFixed(2)}`} />
      </div>

      {/* Format breakdown */}
      <Section title="By Format">
        {[...byFormat.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([format, count]) => (
            <Bar key={format} label={format} count={count} total={totalRecords} />
          ))}
      </Section>

      {/* Condition breakdown */}
      <Section title="By Condition">
        {[...byCondition.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([cond, count]) => (
            <Bar
              key={cond}
              label={`${cond} — ${CONDITION_LABELS[cond as keyof typeof CONDITION_LABELS] ?? cond}`}
              count={count}
              total={totalRecords}
            />
          ))}
      </Section>

      {/* Top artists */}
      {topArtists.length > 0 && (
        <Section title="Top Artists">
          {topArtists.map(([artist, count]) => (
            <Bar key={artist} label={artist} count={count} total={totalRecords} />
          ))}
        </Section>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-800/80 p-4 text-center">
      <p className="text-xl font-bold text-amber-400">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{label}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-gray-800/80 p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-300">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Bar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = (count / total) * 100;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-gray-300">{label}</span>
        <span className="text-gray-500">
          {count} ({pct.toFixed(0)}%)
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-700">
        <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
