export function formatRelativeTime(isoTimestamp: string): string {
  const now = new Date();
  const targetDate = new Date(isoTimestamp);

  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  const timeUnits = [
    { unit: 'second(s)', value: 1 },
    { unit: 'minute(s)', value: 60 },
    { unit: 'hour(s)', value: 60 * 60 },
    { unit: 'day(s)', value: 60 * 60 * 24 },
    { unit: 'week(s)', value: 60 * 60 * 24 * 7 },
    { unit: 'month(s)', value: 60 * 60 * 24 * 30 },
    { unit: 'year(s)', value: 60 * 60 * 24 * 365 },
  ];

  for (const { unit, value } of timeUnits.reverse()) {
    if (diffInSeconds >= value) {
      const diff = Math.floor(diffInSeconds / value);
      return `${diff} ${unit} ago`;
    }
  }

  // 0 秒前の場合
  return 'たった今';
}
