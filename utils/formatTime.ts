export function formatTime(dateString: string): string {
  if (!dateString) return '';

  const timePart = dateString.split('T')[1] || '';
  const hasTimezone = timePart.includes('Z') || timePart.includes('+') || timePart.includes('-');
  const kstDateString = hasTimezone ? dateString : `${dateString}+09:00`;

  const date = new Date(kstDateString);
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) {
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
  }

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 30) return `${diffDays}일 전`;
  if (diffMonths < 12) return `${diffMonths}달 전`;
  return `${diffYears}년 전`;
}
