import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { LabeledInput } from '../components/LabeledInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { saveSettings, setOnboarded } from '../storage/storage';
import { RootStackParamList } from '../types/navigation';
import { isNotFutureDate, isValidDateString } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'SmokingSettings'>;

export function SmokingSettingsScreen({ navigation }: Props) {
  const [packPrice, setPackPrice] = useState('600');
  const [daysPerPack, setDaysPerPack] = useState('1');
  const [minutesPerCigarette, setMinutesPerCigarette] = useState('5');
  const [quitStartDate, setQuitStartDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSave = async () => {
    const parsedPackPrice = Number(packPrice);
    const parsedDaysPerPack = Number(daysPerPack);
    const parsedMinutes = Number(minutesPerCigarette);

    if (Number.isNaN(parsedPackPrice) || parsedPackPrice < 1) return Alert.alert('入力エラー', '1箱の価格は1以上で入力してください。');
    if (Number.isNaN(parsedDaysPerPack) || parsedDaysPerPack <= 0) return Alert.alert('入力エラー', '1箱を吸い切る日数は0より大きい値を入力してください。');
    if (Number.isNaN(parsedMinutes) || parsedMinutes <= 0) return Alert.alert('入力エラー', '1本あたりの喫煙時間は0より大きい値を入力してください。');
    if (!isValidDateString(quitStartDate)) return Alert.alert('入力エラー', '禁煙開始日は YYYY-MM-DD 形式の正しい日付を入力してください。');
    if (!isNotFutureDate(quitStartDate)) return Alert.alert('入力エラー', '禁煙開始日は今日以前の日付を入力してください。');

    await saveSettings({ packPrice: parsedPackPrice, daysPerPack: parsedDaysPerPack, minutesPerCigarette: parsedMinutes, quitStartDate: new Date(`${quitStartDate}T00:00:00.000Z`).toISOString() });
    await setOnboarded(true);
    navigation.replace('Home');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>喫煙設定</Text>
      <LabeledInput label="1箱の価格（円）" keyboardType="numeric" value={packPrice} onChangeText={setPackPrice} />
      <LabeledInput label="1箱を吸い切る日数" keyboardType="numeric" value={daysPerPack} onChangeText={setDaysPerPack} />
      <LabeledInput label="1本あたりの喫煙時間（分）" keyboardType="numeric" value={minutesPerCigarette} onChangeText={setMinutesPerCigarette} />
      <LabeledInput label="禁煙開始日（YYYY-MM-DD）" value={quitStartDate} onChangeText={setQuitStartDate} />
      <PrimaryButton title="保存して開始" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#F7F7F7' }, container: { padding: 20 }, title: { fontSize: 28, fontWeight: '800', marginBottom: 16, color: '#111' } });
