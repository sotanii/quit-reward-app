import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>禁煙×ごほうびアプリ</Text>
      <Text style={styles.text}>浮いたお金と時間を見える化して、欲しい商品の達成を目指しましょう。</Text>
      <PrimaryButton title="はじめる" onPress={() => navigation.replace('SmokingSettings')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F7F7F7' },
  title: { fontSize: 30, fontWeight: '800', marginBottom: 12, color: '#111' },
  text: { fontSize: 16, marginBottom: 20, color: '#555', lineHeight: 24 },
});
