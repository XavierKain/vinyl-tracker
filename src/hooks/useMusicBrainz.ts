import { useState } from 'react';

interface MusicBrainzRelease {
  title: string;
  'artist-credit': Array<{ artist: { name: string } }>;
  date?: string;
  barcode?: string;
}

interface LookupResult {
  artist: string;
  album: string;
  year?: number;
}

export function useMusicBrainz() {
  const [looking, setLooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookupBarcode(barcode: string): Promise<LookupResult | null> {
    setLooking(true);
    setError(null);
    try {
      const res = await fetch(
        `https://musicbrainz.org/ws/2/release/?query=barcode:${encodeURIComponent(barcode)}&fmt=json&limit=5`,
        { headers: { 'User-Agent': 'VinylTracker/1.0 (vinyl-tracker-pwa)' } },
      );
      if (!res.ok) throw new Error('MusicBrainz lookup failed');
      const data = await res.json();
      const releases: MusicBrainzRelease[] = data.releases ?? [];
      if (releases.length === 0) {
        setError('No results found for this barcode');
        return null;
      }
      const release = releases[0];
      const artist =
        release['artist-credit']?.map((c) => c.artist.name).join(', ') ?? 'Unknown Artist';
      const year = release.date ? parseInt(release.date.slice(0, 4), 10) : undefined;
      return { artist, album: release.title, year: isNaN(year!) ? undefined : year };
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lookup failed');
      return null;
    } finally {
      setLooking(false);
    }
  }

  return { lookupBarcode, looking, error };
}
