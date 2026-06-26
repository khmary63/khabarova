/**
 * Optimize a Supabase Storage public image URL by routing it through the
 * image transformation endpoint (resize + re-encode). This drastically
 * reduces the payload for blog card thumbnails, which are otherwise served
 * as multi-megabyte PNGs with `cache-control: no-cache`.
 *
 * Falls back to the original URL when it is not a Supabase storage object.
 */
export function optimizedImage(
  url: string | null | undefined,
  opts: { width?: number; quality?: number } = {},
): string | undefined {
  if (!url) return undefined;
  const { width = 800, quality = 70 } = opts;
  const marker = "/storage/v1/object/public/";
  if (!url.includes(marker)) return url;
  const rendered = url.replace(marker, "/storage/v1/render/image/public/");
  const sep = rendered.includes("?") ? "&" : "?";
  return `${rendered}${sep}width=${width}&quality=${quality}&resize=contain`;
}
