import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

import { LabeledInput } from '../components/LabeledInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { getRewardItems, saveRewardItems } from '../storage/storage';
import { RootStackParamList } from '../types/navigation';
import { isValidHttpUrl } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'AddRewardItem'>;

export function AddRewardItemScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [memo, setMemo] = useState('');

  const onSave = async () => {
    if (!name.trim()) {
      return Alert.alert('入力エラー', '商品名を入力してください。');
    }

    const parsedPrice = Number(price);

    if (!price.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      return Alert.alert('入力エラー', '価格は1以上の数値を入力してください。');
    }

    if (!url.trim()) {
      return Alert.alert('入力エラー', '商品URLを入力してください。');
    }

    if (!isValidHttpUrl(url)) {
      return Alert.alert(
        '入力エラー',
        'URLは http:// または https:// で始めてください。'
      );
    }

    const trimmedImageUrl = imageUrl.trim();
    if (trimmedImageUrl && !isValidHttpUrl(trimmedImageUrl)) {
      return Alert.alert(
        '入力エラー',
        '画像URLは http:// または https:// で始めてください。'
      );
    }

    const items = await getRewardItems();

    items.unshift({
      id: uuidv4(),
      name: name.trim(),
      price: parsedPrice,
      url: url.trim(),
      imageUrl: trimmedImageUrl || undefined,
      memo: memo.trim() || undefined,
      createdAt: new Date().toISOString(),
    });

    await saveRewardItems(items);

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>商品を追加</Text>

      <LabeledInput label="商品名" value={name} onChangeText={setName} />

      <LabeledInput
        label="価格（円）"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <LabeledInput label="商品URL" value={url} onChangeText={setUrl} />

      <LabeledInput
        label="画像URL（任意）"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <LabeledInput
        label="メモ（任意）"
        value={memo}
        onChangeText={setMemo}
        multiline
      />

      <PrimaryButton title="保存" onPress={onSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 12,
    color: '#111',
  },
});