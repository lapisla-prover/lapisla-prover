export function formatRelativeTime(isoTimestamp: string): string {
  const now = new Date();
  const targetDate = new Date(isoTimestamp);

  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  const timeUnits = [
    { unit: '秒', value: 1 },
    { unit: '分', value: 60 },
    { unit: '時間', value: 60 * 60 },
    { unit: '日', value:  60 * 60 * 24 },
    { unit: '週間', value: 60 * 60 * 24 * 7 },
    { unit: 'ヶ月', value: 60 * 60 * 24 * 30 }, 
    { unit: '年', value: 60 * 60 * 24 * 365 }, 
  ];

  for (const { unit, value } of timeUnits.reverse()) {
    if (diffInSeconds >= value) {
      const diff = Math.floor(diffInSeconds / value);
      return `${diff} ${unit}前`;
    }
  }

  // 0 秒前の場合
  return 'たった今';
}
