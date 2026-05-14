import { RewardItem, SmokingSettings } from '../types';

export const CIGARETTES_PER_PACK = 20;

export function getQuitDays(quitStartDate: string): number {
  const start = new Date(quitStartDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffMs = today.getTime() - start.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function getDailyCigarettes(daysPerPack: number): number {
  return CIGARETTES_PER_PACK / daysPerPack;
}

export function getDailySmokingCost(settings: SmokingSettings): number {
  return settings.packPrice / settings.daysPerPack;
}

export function getOriginalSavedAmount(settings: SmokingSettings): number {
  return getDailySmokingCost(settings) * getQuitDays(settings.quitStartDate);
}

export function getSavedTimeMinutes(settings: SmokingSettings): number {
  const quitDays = getQuitDays(settings.quitStartDate);
  return settings.minutesPerCigarette * getDailyCigarettes(settings.daysPerPack) * quitDays;
}

export function getSlipCost(settings: SmokingSettings, totalSlipCount: number): number {
  const perCigarettePrice = settings.packPrice / CIGARETTES_PER_PACK;
  return perCigarettePrice * totalSlipCount;
}

export function getNetSavedAmount(settings: SmokingSettings, totalSlipCount: number): number {
  return Math.max(0, getOriginalSavedAmount(settings) - getSlipCost(settings, totalSlipCount));
}

export function getRewardProgress(item: RewardItem, netSavedAmount: number) {
  const remaining = Math.max(0, item.price - netSavedAmount);
  const isAchieved = netSavedAmount >= item.price;
  const progress = Math.min(100, Math.floor((netSavedAmount / item.price) * 100));

  return {
    remaining,
    isAchieved,
    progress,
  };
}

export function formatYen(amount: number): string {
  return `¥${Math.round(amount).toLocaleString('ja-JP')}`;
}