import AsyncStorage from '@react-native-async-storage/async-storage';
import { RewardItem, SlipRecord, SmokingSettings } from '../types';

const KEYS = {
  ONBOARDED: 'onboarded',
  SETTINGS: 'smokingSettings',
  REWARD_ITEMS: 'rewardItems',
  SLIP_RECORDS: 'slipRecords',
};

export const defaultSettings: SmokingSettings = {
  packPrice: 600,
  daysPerPack: 1,
  minutesPerCigarette: 5,
  quitStartDate: new Date().toISOString(),
};

export async function setOnboarded(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDED, JSON.stringify(value));
}

export async function getOnboarded(): Promise<boolean> {
  const value = await AsyncStorage.getItem(KEYS.ONBOARDED);
  return value ? JSON.parse(value) : false;
}

export async function saveSettings(settings: SmokingSettings): Promise<void> {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export async function getSettings(): Promise<SmokingSettings> {
  const value = await AsyncStorage.getItem(KEYS.SETTINGS);
  return value ? JSON.parse(value) : defaultSettings;
}

export async function saveRewardItems(items: RewardItem[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.REWARD_ITEMS, JSON.stringify(items));
}

export async function getRewardItems(): Promise<RewardItem[]> {
  const value = await AsyncStorage.getItem(KEYS.REWARD_ITEMS);
  return value ? JSON.parse(value) : [];
}

export async function saveSlipRecords(records: SlipRecord[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.SLIP_RECORDS, JSON.stringify(records));
}

export async function getSlipRecords(): Promise<SlipRecord[]> {
  const value = await AsyncStorage.getItem(KEYS.SLIP_RECORDS);
  return value ? JSON.parse(value) : [];
}