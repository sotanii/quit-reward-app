import type { RewardItem } from './index';

export type RootStackParamList = {
  Onboarding: undefined;
  SmokingSettings: undefined;
  Home: undefined;
  AddRewardItem: undefined;
  RewardItemDetail: { item: RewardItem };
  Settings: undefined;
};