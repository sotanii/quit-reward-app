import React, { useEffect, useState } from 'react';
import {
    Button,
    Linking,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getSettings, getSlipRecords } from '../storage/storage';
import { RootStackParamList } from '../types/navigation';

import {
    formatYen,
    getNetSavedAmount,
    getRewardProgress,
} from '../utils/calculations';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'RewardItemDetail'
>;

export function RewardItemDetailScreen({ route }: Props) {
  const { item } = route.params;

  const [saved, setSaved] = useState(0);

  useEffect(() => {
    (async () => {
      const settings = await getSettings();

      const slips = await getSlipRecords();

      const total = slips.reduce(
        (sum, s) => sum + s.count,
        0
      );

      setSaved(getNetSavedAmount(settings, total));
    })();
  }, []);

  const progress = getRewardProgress(item, saved);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{item.name}</Text>

      <Text style={styles.row}>
        価格: {formatYen(item.price)}
      </Text>

      <Text style={styles.row}>
        達成率: {progress.progress}%
      </Text>

      <Text style={styles.row}>
        {progress.isAchieved
          ? '🎉 購入可能です'
          : `あと ${formatYen(progress.remaining)}`}
      </Text>

      <Text style={styles.row}>
        URL: {item.url}
      </Text>

      <Text style={styles.row}>
        メモ: {item.memo || '-'}
      </Text>

      <Button
        title="Amazonで見る"
        onPress={() => Linking.openURL(item.url)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  name: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },

  row: {
    fontSize: 16,
    marginBottom: 8,
  },
});