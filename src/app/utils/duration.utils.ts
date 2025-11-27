/**
 * Converts a duration string in HH:MM:SS format to total seconds
 * @param timeString - Duration string in format "HH:MM:SS" or "H:MM:SS"
 * @returns Total duration in seconds
 * @throws Error if the format is invalid
 *
 * @example
 * durationToSeconds("01:47:06") // returns 6426
 * durationToSeconds("0:37:30") // returns 2250
 */
export function durationToSeconds(timeString: string): number {
  const parts = timeString.split(':').map(p => parseInt(p, 10));

  if (parts.length === 3 && parts.every(p => !isNaN(p) && p >= 0)) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  throw new Error(`Invalid duration format: ${timeString}. Expected format: HH:MM:SS`);
}

/**
 * Converts total seconds to a formatted duration string
 * @param seconds - Total duration in seconds
 * @returns Formatted duration string in "HH:MM:SS" format
 *
 * @example
 * secondsToDuration(6426) // returns "01:47:06"
 * secondsToDuration(2250) // returns "00:37:30"
 */
export function secondsToDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
