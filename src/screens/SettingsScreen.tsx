import React, { useEffect, useState } from 'react';

import {
    Alert,
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    getSettings,
    saveSettings,
} from '../storage/storage';

export function SettingsScreen() {
  const [packPrice, setPackPrice] =
    useState('');

  const [daysPerPack, setDaysPerPack] =
    useState('');

  const [
    minutesPerCigarette,
    setMinutesPerCigarette,
  ] = useState('');

  const [quitStartDate, setQuitStartDate] =
    useState('');

  useEffect(() => {
    (async () => {
      const settings = await getSettings();

      setPackPrice(
        String(settings.packPrice)
      );

      setDaysPerPack(
        String(settings.daysPerPack)
      );

      setMinutesPerCigarette(
        String(settings.minutesPerCigarette)
      );

      setQuitStartDate(
        settings.quitStartDate.slice(0, 10)
      );
    })();
  }, []);

  const onSave = async () => {
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

    Alert.alert(
      '保存しました',
      '設定を更新しました。'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        設定
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
        placeholder="1箱の日数"
      />

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={minutesPerCigarette}
        onChangeText={
          setMinutesPerCigarette
        }
        placeholder="1本の時間"
      />

      <TextInput
        style={styles.input}
        value={quitStartDate}
        onChangeText={setQuitStartDate}
        placeholder="禁煙開始日"
      />

      <Button
        title="保存"
        onPress={onSave}
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