import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RewardItem } from '../types';
import { formatYen } from '../utils/calculations';

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

  // あと何日で届くか（1日あたりの節約額がゼロ以下なら「---」表示）
  const daysLeft = dailySaving > 0 ? Math.ceil(remaining / dailySaving) : null;

  return (
    <View style={styles.container}>
      {/* ヘッダー: 商品名 + 進捗率 */}
      <View style={styles.header}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.progressText}>
          {isAchieved ? '🎉 達成！' : `${Math.floor(progress)}%`}
        </Text>
      </View>

      {/* 金額表示 */}
      <View style={styles.amountRow}>
        <Text style={styles.savedAmount}>{formatYen(netSaved)}</Text>
        <Text style={styles.separator}> / </Text>
        <Text style={styles.targetAmount}>{formatYen(item.price)}</Text>
      </View>

      {/* メーター本体: タバコを抽象化した横長バー */}
      <View style={styles.meterWrap}>
        {/* 左端: フィルター部分（あと何日） */}
        <View style={styles.filterSection}>
          <Text style={styles.filterText}>
            {isAchieved ? '✨' : daysLeft !== null ? `あと\n${daysLeft}日` : '---'}
          </Text>
        </View>

        {/* 右側: メーター本体 */}
        <View style={styles.meterBody}>
          {/* 進捗バー */}
          <View style={[styles.meterFill, { width: `${progress}%` }]}>
            {progress > 15 && (
              <Text style={styles.meterFillText}>{formatYen(netSaved)}</Text>
            )}
          </View>

          {/* 達成時のオーバーレイ */}
          {isAchieved && (
            <View style={styles.achievedOverlay}>
              <Text style={styles.achievedText}>🎉 購入可能になりました！</Text>
            </View>
          )}
        </View>
      </View>

      {/* フッター: 残り金額 */}
      {!isAchieved && (
        <Text style={styles.remainingText}>
          あと {formatYen(remaining)}{daysLeft !== null ? `（約${daysLeft}日）` : ''}
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

  // ヘッダー
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

  // 金額行
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

  // メーター本体
  meterWrap: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },

  // 左端フィルター部分
  filterSection: {
    width: 56,
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

  // メーター右側本体
  meterBody: {
    flex: 1,
    backgroundColor: '#ECEFED',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // 進捗バー（ミント/グリーン）
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

  // 達成オーバーレイ
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

  // フッター
  remainingText: {
    fontSize: 13,
    color: '#777',
    marginTop: 8,
    textAlign: 'right',
  },
});
