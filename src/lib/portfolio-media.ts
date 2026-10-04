/** Shared helpers for portfolio gallery media (images, file video, YouTube). */

const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{6,15}$/;
const FILE_VIDEO_RE = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;

export type PortfolioMediaKind = "image" | "file-video" | "youtube";

export function isValidYoutubeId(id: string | null | undefined): id is string {
  return typeof id === "string" && YOUTUBE_ID_RE.test(id);
}

/**
 * Safely extract a YouTube video id from common URL shapes.
 * Returns null for anything that is not a recognized YouTube watch/shorts/share link.
 */
export function extractYoutubeId(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0]?.split("?")[0];
      return isValidYoutubeId(id) ? id : null;
    }

    const youtubeHosts = new Set([
      "youtube.com",
      "m.youtube.com",
      "music.youtube.com",
      "youtube-nocookie.com",
    ]);
    if (!youtubeHosts.has(host)) return null;

    const watchId = url.searchParams.get("v");
    if (isValidYoutubeId(watchId)) return watchId;

    const pathMatch = url.pathname.match(
      /^\/(?:shorts|embed|live|v|e)\/([A-Za-z0-9_-]{6,15})\/?$/,
    );
    if (pathMatch && isValidYoutubeId(pathMatch[1])) return pathMatch[1];

    return null;
  } catch {
    return null;
  }
}

/** Build a privacy-enhanced embed URL from a validated id only (never pass through arbitrary URLs). */
export function youtubeEmbedUrl(id: string, opts?: { autoplay?: boolean; mute?: boolean }): string {
  if (!isValidYoutubeId(id)) {
    throw new Error("Invalid YouTube id");
  }
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (opts?.autoplay) params.set("autoplay", "1");
  if (opts?.mute ?? opts?.autoplay) params.set("mute", "1");
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function youtubeThumbnailUrl(id: string): string {
  if (!isValidYoutubeId(id)) return "";
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function isFileVideoUrl(url: string): boolean {
  return FILE_VIDEO_RE.test(url.trim());
}

export function isSupportedVideoUrl(url: string): boolean {
  return Boolean(extractYoutubeId(url)) || isFileVideoUrl(url);
}

export function getPortfolioMediaKind(url: string): PortfolioMediaKind {
  if (extractYoutubeId(url)) return "youtube";
  if (isFileVideoUrl(url)) return "file-video";
  return "image";
}

export function pickCoverUrl(media: string[]): string {
  const image = media.find((u) => getPortfolioMediaKind(u) === "image");
  return image || media[0] || "";
}
