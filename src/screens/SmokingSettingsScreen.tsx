import React, { useState } from 'react';
import {
    Alert,
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { saveSettings, setOnboarded } from '../storage/storage';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'SmokingSettings'
>;

export function SmokingSettingsScreen({ navigation }: Props) {
  const [packPrice, setPackPrice] = useState('600');

  const [daysPerPack, setDaysPerPack] = useState('1');

  const [minutesPerCigarette, setMinutesPerCigarette] =
    useState('5');

  const [quitStartDate, setQuitStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const handleSave = async () => {
    if (
      !packPrice ||
      !daysPerPack ||
      !minutesPerCigarette ||
      !quitStartDate
    ) {
      Alert.alert(
        '入力エラー',
        'すべて入力してください'
      );

      return;
    }

    await saveSettings({
      packPrice: Number(packPrice),
      daysPerPack: Number(daysPerPack),
      minutesPerCigarette: Number(
        minutesPerCigarette
      ),
      quitStartDate: new Date(
        quitStartDate
      ).toISOString(),
    });

    await setOnboarded(true);

    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        喫煙設定
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={packPrice}
        onChangeText={setPackPrice}
        placeholder="1箱の価格"
      />

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={daysPerPack}
        onChangeText={setDaysPerPack}
        placeholder="1箱を吸い切る日数"
      />

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={minutesPerCigarette}
        onChangeText={setMinutesPerCigarette}
        placeholder="1本あたりの喫煙時間"
      />

      <TextInput
        style={styles.input}
        value={quitStartDate}
        onChangeText={setQuitStartDate}
        placeholder="禁煙開始日 (YYYY-MM-DD)"
      />

      <Button
        title="保存して開始"
        onPress={handleSave}
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

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
});