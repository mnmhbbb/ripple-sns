export function formatTimeAgo(time: Date | string | number) {
  const start = new Date(time);
  const end = new Date();

  const secondDiff = Math.floor((end.getTime() - start.getTime()) / 1000);
  if (secondDiff < 60) return "방금 전";

  const minuteDiff = Math.floor(secondDiff / 60);
  if (minuteDiff < 60) return `${minuteDiff}분 전`;

  const hourDiff = Math.floor(minuteDiff / 60);
  if (hourDiff < 24) return `${hourDiff}시간 전`;

  const dayDiff = Math.floor(hourDiff / 24);
  if (dayDiff < 30) return `${dayDiff}일 전`;

  const monthDiff = Math.floor(dayDiff / 30);
  if (monthDiff < 12) return `${monthDiff}개월 전`;

  const yearDiff = Math.floor(dayDiff / 365);
  return `${yearDiff}년 전`;
}
