import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { LabeledInput } from '../components/LabeledInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { getSettings, resetAllData, saveSettings } from '../storage/storage';
import { RootStackParamList } from '../types/navigation';
import { isValidDateString } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const [packPrice, setPackPrice] = useState('');
  const [daysPerPack, setDaysPerPack] = useState('');
  const [minutesPerCigarette, setMinutesPerCigarette] = useState('');
  const [quitStartDate, setQuitStartDate] = useState('');

  useEffect(() => {
    (async () => {
      const settings = await getSettings();
      setPackPrice(String(settings.packPrice));
      setDaysPerPack(String(settings.daysPerPack));
      setMinutesPerCigarette(String(settings.minutesPerCigarette));
      setQuitStartDate(settings.quitStartDate.slice(0, 10));
    })();
  }, []);

  const onSave = async () => {
    const parsedPackPrice = Number(packPrice);
    const parsedDaysPerPack = Number(daysPerPack);
    const parsedMinutes = Number(minutesPerCigarette);

    if (Number.isNaN(parsedPackPrice) || parsedPackPrice < 1) return Alert.alert('入力エラー', '1箱の価格は1以上で入力してください。');
    if (Number.isNaN(parsedDaysPerPack) || parsedDaysPerPack <= 0) return Alert.alert('入力エラー', '1箱を吸い切る日数は0より大きい値を入力してください。');
    if (Number.isNaN(parsedMinutes) || parsedMinutes <= 0) return Alert.alert('入力エラー', '1本あたりの喫煙時間は0より大きい値を入力してください。');
    if (!isValidDateString(quitStartDate)) return Alert.alert('入力エラー', '禁煙開始日は YYYY-MM-DD 形式の正しい日付を入力してください。');

    await saveSettings({ packPrice: parsedPackPrice, daysPerPack: parsedDaysPerPack, minutesPerCigarette: parsedMinutes, quitStartDate: new Date(`${quitStartDate}T00:00:00.000Z`).toISOString() });
    Alert.alert('保存しました', '設定を更新しました。');
  };

  const onResetAll = () => {
    Alert.alert('確認', 'すべてのデータをリセットしますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: 'リセット',
        style: 'destructive',
        onPress: async () => {
          await resetAllData();
          navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>設定</Text>
      <LabeledInput label="1箱の価格（円）" keyboardType="numeric" value={packPrice} onChangeText={setPackPrice} />
      <LabeledInput label="1箱を吸い切る日数" keyboardType="numeric" value={daysPerPack} onChangeText={setDaysPerPack} />
      <LabeledInput label="1本あたりの喫煙時間（分）" keyboardType="numeric" value={minutesPerCigarette} onChangeText={setMinutesPerCigarette} />
      <LabeledInput label="禁煙開始日（YYYY-MM-DD）" value={quitStartDate} onChangeText={setQuitStartDate} />
      <PrimaryButton title="保存" onPress={onSave} />
      <Text style={styles.space} />
      <PrimaryButton title="すべてのデータをリセット" onPress={onResetAll} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#F7F7F7' }, container: { padding: 20 }, title: { fontSize: 28, fontWeight: '800', marginBottom: 16, color: '#111' }, space: { height: 12 } });
