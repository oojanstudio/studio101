/**
 * Format a timestamp to a human-readable relative duration (e.g., "2 days ago").
 * @param timestamp - ISO 8601 timestamp string or Date object
 * @param baseTime - Optional base time for testing (defaults to now)
 * @returns Human-readable duration string
 */
export function formatDurationSince(
  timestamp: string | Date,
  baseTime = new Date(),
): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const seconds = Math.floor(
    (baseTime.getTime() - date.getTime()) / 1000,
  );

  if (seconds < 60) {
    return "now";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks}w ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}mo ago`;
  }

  const years = Math.floor(months / 12);
  return `${years}y ago`;
}
