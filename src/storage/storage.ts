import AsyncStorage from '@react-native-async-storage/async-storage';
import { RewardItem, SlipRecord, SmokingSettings } from '../types';

const KEYS = {
  ONBOARDED: 'onboarded',
  SETTINGS: 'smokingSettings',
  REWARD_ITEMS: 'rewardItems',
  SLIP_RECORDS: 'slipRecords',
};

export function createDefaultSettings(): SmokingSettings {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return {
    packPrice: 600,
    daysPerPack: 1,
    minutesPerCigarette: 5,
    quitStartDate: today.toISOString(),
  };
}

/** @deprecated Use createDefaultSettings() instead for a fresh date */
export const defaultSettings: SmokingSettings = createDefaultSettings();

function safeParse<T>(json: string | null, fallback: T): T {
  if (json === null) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export async function setOnboarded(value: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.ONBOARDED, JSON.stringify(value));
  } catch {
    // 保存失敗時もアプリを落とさない
  }
}

export async function getOnboarded(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(KEYS.ONBOARDED);
    return safeParse(value, false);
  } catch {
    return false;
  }
}

export async function saveSettings(settings: SmokingSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // 保存失敗時もアプリを落とさない
  }
}

export async function getSettings(): Promise<SmokingSettings> {
  try {
    const value = await AsyncStorage.getItem(KEYS.SETTINGS);
    return safeParse(value, createDefaultSettings());
  } catch {
    return createDefaultSettings();
  }
}

export async function saveRewardItems(items: RewardItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.REWARD_ITEMS, JSON.stringify(items));
  } catch {
    // 保存失敗時もアプリを落とさない
  }
}

export async function getRewardItems(): Promise<RewardItem[]> {
  try {
    const value = await AsyncStorage.getItem(KEYS.REWARD_ITEMS);
    return safeParse(value, []);
  } catch {
    return [];
  }
}

export async function saveSlipRecords(records: SlipRecord[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SLIP_RECORDS, JSON.stringify(records));
  } catch {
    // 保存失敗時もアプリを落とさない
  }
}

export async function getSlipRecords(): Promise<SlipRecord[]> {
  try {
    const value = await AsyncStorage.getItem(KEYS.SLIP_RECORDS);
    return safeParse(value, []);
  } catch {
    return [];
  }
}

export async function resetAllData(): Promise<void> {
  const freshDefaults = createDefaultSettings();
  try {
    await AsyncStorage.multiSet([
      [KEYS.ONBOARDED, JSON.stringify(false)],
      [KEYS.SETTINGS, JSON.stringify(freshDefaults)],
      [KEYS.REWARD_ITEMS, JSON.stringify([])],
      [KEYS.SLIP_RECORDS, JSON.stringify([])],
    ]);
  } catch {
    // リセット失敗時もアプリを落とさない
  }
}
