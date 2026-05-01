export type Coords = { lat: number; lng: number };

/**
 * Parses the Supabase geography column into lat/lng.
 * Supabase REST returns geography as EWKB hex; handles GeoJSON and WKT as fallbacks.
 */
export function parseLocation(raw: string | null): Coords | null {
  if (!raw) return null;

  // GeoJSON: {"type":"Point","coordinates":[lng,lat]}
  try {
    const geo = JSON.parse(raw);
    if (geo.type === 'Point' && Array.isArray(geo.coordinates)) {
      return { lng: geo.coordinates[0], lat: geo.coordinates[1] };
    }
  } catch {}

  // EWKB hex (default Supabase REST format for geography)
  if (/^[0-9a-fA-F]+$/.test(raw) && raw.length >= 42) {
    const bytes = new Uint8Array(raw.length / 2);
    for (let i = 0; i < raw.length; i += 2) {
      bytes[i / 2] = parseInt(raw.slice(i, i + 2), 16);
    }
    const view    = new DataView(bytes.buffer);
    const le      = bytes[0] === 1;
    const wkbType = view.getUint32(1, le);
    const hasSRID = (wkbType & 0x20000000) !== 0;
    const offset  = 5 + (hasSRID ? 4 : 0);
    const lng = view.getFloat64(offset,     le);
    const lat = view.getFloat64(offset + 8, le);
    if (!isNaN(lng) && !isNaN(lat)) return { lat, lng };
  }

  // WKT fallback: POINT(lng lat)
  const m = raw.match(/POINT\(([^\s)]+)\s+([^\s)]+)\)/);
  if (m) return { lng: parseFloat(m[1]), lat: parseFloat(m[2]) };

  return null;
}
