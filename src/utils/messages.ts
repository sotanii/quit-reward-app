import { CIGARETTES_PER_PACK, getPacksRemaining } from './calculations';
import { RewardItem, SlipRecord, SmokingSettings } from '../types';

/**
 * ホーム画面上部に表示する起動時メッセージを生成する。
 *
 * UX方針:
 *   ✅ 未来 / 積み上げ / 近づく / 届く / ごほうび / 続ける / 優しい継続
 *   ❌ 我慢 / 失敗 / 吸うな / 禁煙しろ / 反省
 */

type MessageContext = {
  settings: SmokingSettings;
  netSaved: number;
  dailySaving: number;
  quitDays: number;
  slips: SlipRecord[];
  items: RewardItem[];
};

export function generateMotivationMessage(ctx: MessageContext): string {
  const candidates: string[] = [];
  const { settings, netSaved, dailySaving, quitDays, slips, items } = ctx;
  const hasAccumulated = quitDays >= 1;

  // ── 0日目（開始当日）のウェルカム ──
  if (quitDays === 0) {
    candidates.push('今日から少しずつ、欲しいものに近づいていきましょう 🌿');
  }

  // ── 週間の節約額メッセージ（1日以上経過後） ──
  const weeklySaving = dailySaving * 7;
  if (hasAccumulated && weeklySaving > 0) {
    candidates.push(
      `今週は約¥${Math.round(weeklySaving).toLocaleString('ja-JP')}分を未来に回せます ✨`
    );
  }

  // ── 3日間の節約額メッセージ（1日以上経過後） ──
  if (hasAccumulated && dailySaving > 0) {
    const elapsedDays = Math.min(quitDays, 3);
    const recentSaving = dailySaving * elapsedDays;
    candidates.push(
      `この${elapsedDays}日で約¥${Math.round(recentSaving).toLocaleString('ja-JP')}分、欲しいものに近づいています 🌱`
    );
  }

  // ── 次のごほうびまでのメッセージ ──
  const unachievedItems = items.filter((item) => item.price > netSaved);
  if (unachievedItems.length > 0) {
    // 最も近い商品
    const closest = unachievedItems.reduce((a, b) =>
      (a.price - netSaved) < (b.price - netSaved) ? a : b
    );
    const remaining = closest.price - netSaved;
    const packsRemaining = getPacksRemaining(remaining, settings.packPrice);

    if (packsRemaining !== null) {
      candidates.push(
        `あと約${packsRemaining}箱分で、次のごほうびに届きます 🎁`
      );
    }

    if (dailySaving > 0) {
      const daysLeft = Math.ceil(remaining / dailySaving);
      candidates.push(
        `あと約${daysLeft}日で「${closest.name}」に届きそうです ✨`
      );
    }
  }

  // ── 吸っちゃった日があっても大丈夫メッセージ ──
  const hasRecentSlip = slips.some((s) => {
    const slipDate = new Date(s.smokedAt);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return slipDate >= threeDaysAgo;
  });

  if (hasRecentSlip) {
    candidates.push(
      '吸っちゃった日があっても大丈夫。ここからまた続けられます 💪'
    );
    candidates.push(
      '完璧じゃなくていい。少しずつ、自分のペースで進んでいこう 🌿'
    );
  }

  // ── 禁煙日数に応じたメッセージ ──
  if (quitDays >= 30) {
    candidates.push(
      `${quitDays}日間も続けてる。すごいペースです！ 🚀`
    );
  } else if (quitDays >= 7) {
    candidates.push(
      `${quitDays}日目。着実に積み上がっています 🌟`
    );
  } else if (quitDays >= 1) {
    candidates.push(
      'はじめの一歩が一番大切。今日も未来に近づいています 🌱'
    );
  }

  // ── 節約額に応じたメッセージ ──
  if (netSaved >= 10000) {
    candidates.push(
      `もう¥${Math.round(netSaved).toLocaleString('ja-JP')}も積み上がりました。すごい！ 🎉`
    );
  } else if (netSaved >= 1000) {
    candidates.push(
      `¥${Math.round(netSaved).toLocaleString('ja-JP')}分の未来が見えてきました 🌈`
    );
  }

  // ── 1本あたりの喫煙時間ベースの時間節約メッセージ（1日以上経過後） ──
  const dailyCigs = CIGARETTES_PER_PACK / (settings.daysPerPack > 0 ? settings.daysPerPack : 1);
  const dailyTimeSaved = settings.minutesPerCigarette * dailyCigs;
  if (hasAccumulated && dailyTimeSaved >= 30) {
    candidates.push(
      `毎日約${Math.round(dailyTimeSaved)}分、自分の時間が増えています ⏰`
    );
  }

  // ── フォールバック ──
  if (candidates.length === 0) {
    candidates.push('今日から少しずつ、欲しいものに近づいていきましょう 🌿');
  }

  // 日付ベースでランダム選択（同日中は同じメッセージを表示）
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % candidates.length;
  return candidates[index];
}
