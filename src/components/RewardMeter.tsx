import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RewardItem } from '../types';
import {
  formatDaysUntil,
  formatYen,
  formatYenContext,
  formatYenStat,
} from '../utils/formatDisplay';

type Props = {
  /** 対象商品 */
  item: RewardItem;
  /** 現在の実質節約額 */
  netSaved: number;
  /** 1日あたりの節約額 */
  dailySaving: number;
};

export function RewardMeter({ item, netSaved, dailySaving }: Props) {
  const progress = item.price > 0
    ? Math.min(100, Math.max(0, (netSaved / item.price) * 100))
    : 100;
  const remaining = Math.max(0, item.price - netSaved);
  const isAchieved = item.price > 0 && netSaved >= item.price;

  const daysLeft = dailySaving > 0 ? Math.ceil(remaining / dailySaving) : null;
  const daysLeftLabel = daysLeft !== null ? formatDaysUntil(daysLeft) : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.progressText}>
          {isAchieved ? '🎉 達成！' : `${Math.floor(progress)}%`}
        </Text>
      </View>

      <View style={styles.amountRow}>
        <Text style={styles.savedAmount}>{formatYenStat(netSaved)}</Text>
        <Text style={styles.separator}> / </Text>
        <Text style={styles.targetAmount}>{formatYen(item.price)}</Text>
      </View>

      <View style={styles.meterWrap}>
        <View style={styles.filterSection}>
          <Text style={styles.filterText}>
            {isAchieved ? '✨' : daysLeftLabel !== null ? `あと\n${daysLeftLabel}` : '---'}
          </Text>
        </View>

        <View style={styles.meterBody}>
          <View style={[styles.meterFill, { width: `${progress}%` }]}>
            {progress > 15 && (
              <Text style={styles.meterFillText}>{formatYenStat(netSaved)}</Text>
            )}
          </View>

          {isAchieved && (
            <View style={styles.achievedOverlay}>
              <Text style={styles.achievedText}>🎉 購入可能になりました！</Text>
            </View>
          )}
        </View>
      </View>

      {!isAchieved && (
        <Text style={styles.remainingText}>
          あと {formatYenContext(remaining, true)}
          {daysLeftLabel !== null ? `（${daysLeftLabel}）` : ''}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    flex: 1,
    marginRight: 8,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#38B98A',
  },

  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  savedAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#38B98A',
  },
  separator: {
    fontSize: 16,
    color: '#999',
    marginHorizontal: 2,
  },
  targetAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
  },

  meterWrap: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },

  filterSection: {
    width: 64,
    backgroundColor: '#E0E8E4',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A7A65',
    textAlign: 'center',
    lineHeight: 14,
  },

  meterBody: {
    flex: 1,
    backgroundColor: '#ECEFED',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: 'center',
    overflow: 'hidden',
  },

  meterFill: {
    height: '100%',
    backgroundColor: '#38B98A',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: 'center',
    paddingHorizontal: 12,
    minWidth: 4,
  },
  meterFillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'right',
  },

  achievedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(56, 185, 138, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievedText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2A8A65',
  },

  remainingText: {
    fontSize: 13,
    color: '#777',
    marginTop: 8,
    textAlign: 'right',
  },
});
