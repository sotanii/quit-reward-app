import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { getRewardItems, getSettings, getSlipRecords, saveRewardItems } from '../storage/storage';
import { RootStackParamList } from '../types/navigation';
import { formatYen, getNetSavedAmount, getRewardProgress } from '../utils/calculations';

type Props = NativeStackScreenProps<RootStackParamList, 'RewardItemDetail'>;

export function RewardItemDetailScreen({ route, navigation }: Props) {
  const { item } = route.params;
  const [saved, setSaved] = useState(0);

  useEffect(() => {
    (async () => {
      const settings = await getSettings();
      const slips = await getSlipRecords();
      const total = slips.reduce((sum, s) => sum + s.count, 0);
      setSaved(getNetSavedAmount(settings, total));
    })();
  }, []);

  const onDelete = () => {
    Alert.alert('確認', 'この商品を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          const items = await getRewardItems();
          const next = items.filter((x) => x.id !== item.id);
          await saveRewardItems(next);
          navigation.navigate('Home');
        },
      },
    ]);
  };

  const handleOpenUrl = async () => {
    try {
      const supported = await Linking.canOpenURL(item.url);
      if (supported) {
        await Linking.openURL(item.url);
      } else {
        Alert.alert('エラー', 'このURLを開けませんでした。');
      }
    } catch {
      Alert.alert('エラー', 'URLを開く際にエラーが発生しました。');
    }
  };

  const progress = getRewardProgress(item, saved);
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{formatYen(item.price)}</Text>
        <Text style={styles.row}>達成率: {progress.progress}%</Text>
        <Text style={styles.row}>{progress.isAchieved ? '🎉 購入可能です' : `あと ${formatYen(progress.remaining)}`}</Text>
        <Text style={styles.row}>URL: {item.url}</Text>
        <Text style={styles.row}>メモ: {item.memo || '-'}</Text>
      </View>
      <PrimaryButton title="商品ページを見る" onPress={handleOpenUrl} />
      <View style={styles.space} />
      <PrimaryButton title="この商品を削除" onPress={onDelete} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F7F7F7', padding: 20 }, card: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 12 }, name: { fontSize: 28, fontWeight: '800', marginBottom: 8, color: '#111' }, price: { fontSize: 28, fontWeight: '800', marginBottom: 10 }, row: { fontSize: 16, marginBottom: 8, color: '#333' }, space: { height: 8 } });
