import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { PrimaryButton } from '../components/PrimaryButton';
import { StatCard } from '../components/StatCard';
import { getRewardItems, getSettings, getSlipRecords, saveSlipRecords } from '../storage/storage';
import { RewardItem, SlipRecord, SmokingSettings } from '../types';
import { RootStackParamList } from '../types/navigation';
import { formatYen, getDailySmokingCost, getNetSavedAmount, getOriginalSavedAmount, getQuitDays, getRewardProgress, getSavedTimeMinutes } from '../utils/calculations';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [settings, setSettings] = useState<SmokingSettings | null>(null);
  const [items, setItems] = useState<RewardItem[]>([]);
  const [slips, setSlips] = useState<SlipRecord[]>([]);
  const [countInput, setCountInput] = useState('1');

  const load = async () => {
    const [s, i, r] = await Promise.all([getSettings(), getRewardItems(), getSlipRecords()]);
    setSettings(s);
    setItems(i);
    setSlips(r);
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  if (!settings) return <View style={styles.container}><Text>読み込み中...</Text></View>;

  const quitDays = getQuitDays(settings.quitStartDate);
  const daily = getDailySmokingCost(settings);
  const originalSaved = getOriginalSavedAmount(settings);
  const totalSlipCount = slips.reduce((sum, s) => sum + s.count, 0);
  const netSaved = getNetSavedAmount(settings, totalSlipCount);
  const savedTime = getSavedTimeMinutes(settings);

  const handleSlipSave = async () => {
    const n = Number(countInput);
    if (Number.isNaN(n) || n <= 0) {
      Alert.alert('入力エラー', '吸った本数は1以上の数値を入力してください。');
      return;
    }

    const newRecord: SlipRecord = { id: uuidv4(), smokedAt: new Date().toISOString(), count: n };
    const next = [newRecord, ...slips];
    await saveSlipRecords(next);
    setSlips(next);
    setCountInput('1');
    Alert.alert('記録しました', 'ここからまた続けましょう。');
  };

  const handleUndoLastSlip = async () => {
    if (slips.length === 0) {
      Alert.alert('お知らせ', '取り消せる記録がありません');
      return;
    }
    const next = slips.slice(1);
    await saveSlipRecords(next);
    setSlips(next);
    Alert.alert('取り消しました', '直近の記録を取り消しました。');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>ホーム</Text>
      <StatCard label="禁煙日数" value={`${quitDays}日`} />
      <StatCard label="実質節約額" value={formatYen(netSaved)} />
      <StatCard label="本来の節約額" value={formatYen(originalSaved)} />
      <StatCard label="節約時間" value={`${Math.round(savedTime)}分`} />
      <StatCard label="1日あたりの節約額" value={formatYen(daily)} />
      <StatCard label="吸っちゃった累計本数" value={`${totalSlipCount}本`} />

      <View style={styles.card}>
        <Text style={styles.section}>吸っちゃった記録</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={countInput} onChangeText={setCountInput} />
        <PrimaryButton title="吸っちゃった" onPress={handleSlipSave} />
        <View style={styles.space} />
        <PrimaryButton title="直近の記録を取り消す" onPress={handleUndoLastSlip} />
      </View>

      <View style={styles.rowButtons}>
        <View style={styles.half}><PrimaryButton title="商品を追加" onPress={() => navigation.navigate('AddRewardItem')} /></View>
        <View style={styles.half}><PrimaryButton title="設定" onPress={() => navigation.navigate('Settings')} /></View>
      </View>

      <Text style={styles.section}>欲しい商品</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={<Text style={styles.empty}>まだ商品がありません</Text>}
        renderItem={({ item }) => {
          const p = getRewardProgress(item, netSaved);
          return (
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('RewardItemDetail', { item })}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{formatYen(item.price)}</Text>
              <Text>{p.isAchieved ? '🎉 購入可能 この商品が買えるようになりました' : `あと ${formatYen(p.remaining)}`}</Text>
              <Text>達成率 {p.progress}%</Text>
            </TouchableOpacity>
          );
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F7F7' },
  content: { padding: 16, paddingBottom: 30 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F7F7' },
  title: { fontSize: 30, fontWeight: '800', marginBottom: 12, color: '#111' },
  section: { fontSize: 18, fontWeight: '700', marginBottom: 8, marginTop: 8, color: '#111' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 12, marginBottom: 10 },
  rowButtons: { flexDirection: 'row', gap: 8, marginVertical: 10 },
  half: { flex: 1 },
  space: { height: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, marginBottom: 8, backgroundColor: '#fff' },
  item: { backgroundColor: '#fff', borderRadius: 14, padding: 12, marginBottom: 8 },
  itemName: { fontSize: 17, fontWeight: '700', color: '#111' },
  itemPrice: { fontSize: 22, fontWeight: '800', marginVertical: 4 },
  empty: { color: '#666' },
});
