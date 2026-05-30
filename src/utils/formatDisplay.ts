/** UI表示向けの人間が把握しやすい数値フォーマット */

/** 金額（商品価格など正確さが必要な場面向け） */
export function formatYen(amount: number): string {
  return `¥${Math.max(0, Math.round(amount)).toLocaleString('ja-JP')}`;
}

/** 節約額など統計向け（大きい金額は「万円」表記） */
export function formatYenStat(amount: number): string {
  const n = Math.max(0, Math.round(amount));
  if (n < 10000) return formatYen(n);

  const man = Math.round(n / 1000) / 10;
  if (man < 100) {
    return Number.isInteger(man) ? `約${man}万円` : `約${man.toFixed(1)}万円`;
  }

  return formatYen(n);
}

/** 残額・商品価格（一覧・詳細向け。大きい場合のみ万円表記） */
export function formatYenContext(amount: number, preferCompact = false): string {
  if (preferCompact && amount >= 10000) return formatYenStat(amount);
  return formatYen(amount);
}

/**
 * 節約時間（分）を体感的な単位で表示
 * 例: 45分 / 1時間30分 / 約16.7時間 / 約2日
 */
export function formatDurationMinutes(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  if (m === 0) return '0分';
  if (m < 60) return `${m}分`;

  if (m < 1440) {
    if (m >= 120) {
      const hours = Math.round((m / 60) * 10) / 10;
      return Number.isInteger(hours) ? `約${hours}時間` : `約${hours.toFixed(1)}時間`;
    }
    const hours = Math.floor(m / 60);
    const rem = m % 60;
    return rem > 0 ? `${hours}時間${rem}分` : `${hours}時間`;
  }

  const days = Math.floor(m / 1440);
  const remMin = m % 1440;
  if (remMin === 0) return `約${days}日`;

  const remHours = Math.round((remMin / 60) * 10) / 10;
  if (remHours <= 0) return `約${days}日`;
  const hourText = Number.isInteger(remHours) ? `${remHours}時間` : `${remHours.toFixed(1)}時間`;
  return `約${days}日${hourText}`;
}

/** 禁煙日数 */
export function formatQuitDays(days: number): string {
  if (days === 0) return '0日';
  if (days < 365) return `${days}日`;
  const years = Math.round((days / 365) * 10) / 10;
  return Number.isInteger(years) ? `約${years}年` : `約${years.toFixed(1)}年`;
}

/** あと何日（到達まで・カウントダウン向け） */
export function formatDaysUntil(days: number): string {
  const d = Math.max(0, Math.ceil(days));
  if (d === 0) return '今日';
  if (d === 1) return '1日';
  if (d < 30) return `${d}日`;
  if (d < 365) {
    const months = Math.round(d / 30);
    return months <= 1 ? '約1ヶ月' : `約${months}ヶ月`;
  }
  const years = Math.round((d / 365) * 10) / 10;
  return Number.isInteger(years) ? `約${years}年` : `約${years.toFixed(1)}年`;
}

/** あと何日（文章用） */
export function formatDaysUntilPhrase(days: number): string {
  const d = Math.max(0, Math.ceil(days));
  if (d === 0) return '今日';
  if (d === 1) return '1日';
  if (d < 30) return `${d}日`;
  if (d < 365) {
    const months = Math.round(d / 30);
    return months <= 1 ? '1ヶ月' : `${months}ヶ月`;
  }
  const years = Math.round((d / 365) * 10) / 10;
  return Number.isInteger(years) ? `${years}年` : `${years.toFixed(1)}年`;
}

/** 箱数 */
export function formatPacks(count: number): string {
  const n = Math.max(0, Math.ceil(count));
  if (n === 1) return '1箱分';
  return `約${n}箱分`;
}

/** 本数 */
export function formatCigaretteCount(count: number): string {
  return `${Math.max(0, Math.round(count))}本`;
}
