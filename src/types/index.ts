export type SmokingSettings = {
  packPrice: number;
  daysPerPack: number;
  minutesPerCigarette: number;
  quitStartDate: string;
};

export type RewardItem = {
  id: string;
  name: string;
  price: number;
  url: string;
  imageUrl?: string;
  memo?: string;
  createdAt: string;
};

export type SlipRecord = {
  id: string;
  smokedAt: string;
  count: number;
};