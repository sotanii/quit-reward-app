import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  label: {
    color: '#666',
    fontSize: 14,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
});