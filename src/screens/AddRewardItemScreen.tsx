import React, { useState } from 'react';
import {
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';

import {
    getRewardItems,
    saveRewardItems,
} from '../storage/storage';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AddRewardItem'
>;

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function AddRewardItemScreen({
  navigation,
}: Props) {
  const [name, setName] = useState('');

  const [price, setPrice] = useState('');

  const [url, setUrl] = useState('');

  const [imageUrl, setImageUrl] =
    useState('');

  const [memo, setMemo] = useState('');

  const onSave = async () => {
    const items = await getRewardItems();

    items.unshift({
      id: createId(),
      name,
      price: Number(price),
      url,
      imageUrl: imageUrl || undefined,
      memo: memo || undefined,
      createdAt: new Date().toISOString(),
    });

    await saveRewardItems(items);

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        商品を追加
      </Text>

      <TextInput
        style={styles.input}
        placeholder="商品名"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="価格"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="商品URL"
        value={url}
        onChangeText={setUrl}
      />

      <TextInput
        style={styles.input}
        placeholder="画像URL（任意）"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <TextInput
        style={styles.input}
        placeholder="メモ（任意）"
        value={memo}
        onChangeText={setMemo}
        multiline
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
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
});