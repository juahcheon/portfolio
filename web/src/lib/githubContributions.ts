export type GithubContributionDay = {
  date: string;
  count: number;
  level: number;
};

export type GithubContributions = {
  username: string;
  days: GithubContributionDay[];
};

/** GitHub's public contribution calendar includes a date cell and a count tooltip. */
export function parseGithubContributions(html: string): GithubContributionDay[] {
  const attribute = (attributes: string, name: string) =>
    attributes.match(new RegExp(`(?:^|\\s)${name}=["']([^"']*)["']`))?.[1];
  const counts = new Map<string, number>();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = attribute(match[1], "for");
    const text = match[2].trim();
    const number = text.match(/^([\d,]+) contributions? on /)?.[1];
    const count = /^No contributions on /.test(text) ? 0 : number ? Number(number.replaceAll(",", "")) : NaN;
    if (id && Number.isSafeInteger(count) && count >= 0) counts.set(id, count);
  }

  const days: GithubContributionDay[] = [];
  for (const match of html.matchAll(/<td\b([^>]*)>/g)) {
    const date = attribute(match[1], "data-date");
    if (!date) continue;
    const levelValue = attribute(match[1], "data-level");
    const level = Number(levelValue);
    const count = counts.get(attribute(match[1], "id") ?? "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) ||
        new Date(date).toISOString().slice(0, 10) !== date ||
        levelValue === undefined || !Number.isInteger(level) || level < 0 || level > 4 || count === undefined) {
      throw new Error("Unsupported GitHub contribution calendar");
    }
    days.push({ date, count, level });
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  if (days.length < 365 || days.length > 371 || days.some((day, index) =>
    index > 0 && Date.parse(day.date) - Date.parse(days[index - 1].date) !== 86_400_000)) {
    throw new Error("Incomplete GitHub contribution calendar");
  }
  return days;
}
