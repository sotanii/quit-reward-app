import React, { useCallback, useState } from 'react';
import {
    Alert,
    Button,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { StatCard } from '../components/StatCard';
import {
    getRewardItems,
    getSettings,
    getSlipRecords,
    saveSlipRecords,
} from '../storage/storage';
import {
    RewardItem,
    SlipRecord,
    SmokingSettings,
} from '../types';
import { RootStackParamList } from '../types/navigation';
import {
    formatYen,
    getDailySmokingCost,
    getNetSavedAmount,
    getOriginalSavedAmount,
    getQuitDays,
    getRewardProgress,
    getSavedTimeMinutes,
} from '../utils/calculations';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function HomeScreen({ navigation }: Props) {
  const [settings, setSettings] =
    useState<SmokingSettings | null>(null);

  const [items, setItems] = useState<RewardItem[]>([]);
  const [slips, setSlips] = useState<SlipRecord[]>([]);
  const [countInput, setCountInput] = useState('1');

  const load = async () => {
    const [s, i, r] = await Promise.all([
      getSettings(),
      getRewardItems(),
      getSlipRecords(),
    ]);

    setSettings(s);
    setItems(i);
    setSlips(r);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  if (!settings) {
    return (
      <ScrollView style={styles.container}>
        <Text>読み込み中...</Text>
      </ScrollView>
    );
  }

  const quitDays = getQuitDays(settings.quitStartDate);
  const daily = getDailySmokingCost(settings);
  const originalSaved = getOriginalSavedAmount(settings);

  const totalSlipCount = slips.reduce(
    (sum, s) => sum + s.count,
    0
  );

  const netSaved = getNetSavedAmount(
    settings,
    totalSlipCount
  );

  const savedTime = getSavedTimeMinutes(settings);

  const handleSlipSave = async () => {
    const n = Number(countInput) || 1;

    const newRecord: SlipRecord = {
      id: createId(),
      smokedAt: new Date().toISOString(),
      count: n,
    };

    const next = [newRecord, ...slips];

    await saveSlipRecords(next);

    setSlips(next);
    setCountInput('1');

    Alert.alert(
      '記録しました',
      'ここからまた続けましょう。'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ホーム</Text>

      <StatCard
        label="禁煙日数"
        value={`${quitDays}日`}
      />

      <StatCard
        label="節約額"
        value={formatYen(netSaved)}
      />

      <StatCard
        label="本来の節約額"
        value={formatYen(originalSaved)}
      />

      <StatCard
        label="節約時間"
        value={`${Math.round(savedTime)}分`}
      />

      <StatCard
        label="1日あたりの節約額"
        value={formatYen(daily)}
      />

      <StatCard
        label="吸っちゃった累計本数"
        value={`${totalSlipCount}本`}
      />

      <View style={styles.slipBox}>
        <Text style={styles.section}>
          吸っちゃった記録
        </Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={countInput}
          onChangeText={setCountInput}
        />

        <Button
          title="吸っちゃった"
          onPress={handleSlipSave}
        />
      </View>

      <View style={styles.actions}>
        <Button
          title="商品を追加"
          onPress={() =>
            navigation.navigate('AddRewardItem')
          }
        />

        <Button
          title="設定"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      <Text style={styles.section}>欲しい商品</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text>まだ商品がありません</Text>
        }
        renderItem={({ item }) => {
          const p = getRewardProgress(item, netSaved);

          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate('RewardItemDetail', {
                  item,
                })
              }
            >
              <Text style={styles.itemName}>
                {item.name}
              </Text>

              <Text>{formatYen(item.price)}</Text>

              <Text>
                {p.isAchieved
                  ? '🎉 購入可能 この商品が買えるようになりました'
                  : `あと ${formatYen(p.remaining)}`}
              </Text>

              <Text>達成率 {p.progress}%</Text>
            </TouchableOpacity>
          );
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 12,
  },

  section: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },

  slipBox: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },

  item: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },

  itemName: {
    fontSize: 17,
    fontWeight: '700',
  },
});