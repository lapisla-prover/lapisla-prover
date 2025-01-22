export function formatRelativeTime(isoTimestamp: string): string {
  const now = new Date();
  const targetDate = new Date(isoTimestamp);

  const diffInSeconds = Math.floor(
    (now.getTime() - targetDate.getTime()) / 1000,
  );

  if (diffInSeconds < 60) {
    return `${diffInSeconds}秒前`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}分前`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}時間前`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}日前`;
  } else if (diffInSeconds < 2592000) {
    // 約30日を1ヶ月とする
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks}週間前`;
  } else if (diffInSeconds < 31536000) {
    // 約365日を1年とする
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months}ヶ月前`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years}年前`;
  }
}
