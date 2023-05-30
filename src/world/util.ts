export const YEAR_FIRST = 2000;
export const YEAR_LAST = 2100;

export function idx2ym(idx: number): [number, number] {
  /**
   * Transform the index of a "step" in a time series (or the simulation) into
   * the respective year/month.
   *
   * Note: Month count starts at 1!
   */
  const yearOffset = Math.floor(idx / 12);
  const month = idx % 12;
  return [YEAR_FIRST + yearOffset, month + 1];
}

export function ym2idx(year: number, month?: number): number {
  /**
   * Given the year (and optionally month), return the index in the time series for that point in time.
   */
  // eslint-disable-next-line no-param-reassign
  if (!month) month = 1;
  return (year - YEAR_FIRST) + month;
}
