export function formatRelativeTime(isoTimestamp: string): string {
  const now = new Date();
  const targetDate = new Date(isoTimestamp);

  const diffInSeconds = Math.floor(
    (now.getTime() - targetDate.getTime()) / 1000,
  );

  const timeUnits = [
    { singular: "second", plural: "seconds", value: 1 },
    { singular: "minute", plural: "minutes", value: 60 },
    { singular: "hour", plural: "hours", value: 60 * 60 },
    { singular: "day", plural: "days", value: 60 * 60 * 24 },
    { singular: "week", plural: "weeks", value: 60 * 60 * 24 * 7 },
    { singular: "month", plural: "months", value: 60 * 60 * 24 * 30 },
    { singular: "year", plural: "years", value: 60 * 60 * 24 * 365 },
  ];

  for (const { singular, plural, value } of timeUnits.reverse()) {
    if (diffInSeconds >= value) {
      const diff = Math.floor(diffInSeconds / value);
      const unit = diff === 1 ? singular : plural;
      return `${diff} ${unit} ago`;
    }
  }

  // 0秒前の場合
  return "just now";
}
