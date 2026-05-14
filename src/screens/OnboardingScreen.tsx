import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>禁煙×ごほうびアプリへようこそ</Text>

      <Text style={styles.text}>
        浮いたお金で欲しいものを買えるようになるまでを可視化します。
      </Text>

      <Button
        title="はじめる"
        onPress={() => navigation.replace('SmokingSettings')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },

  text: {
    fontSize: 16,
    marginBottom: 20,
  },
});