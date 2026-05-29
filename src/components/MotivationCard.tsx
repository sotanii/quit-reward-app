import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  message: string;
};

export function MotivationCard({ message }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EAF7F1',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#38B98A',
  },
  message: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2A6B52',
    lineHeight: 22,
  },
});
