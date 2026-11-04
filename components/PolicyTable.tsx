/**
 * 컴포넌트: 정책 표 (PolicyTable)
 * 역할: 약관·정책 화면에서 쓰는 표를 그립니다. 첫 행은 머리글이며, columnFlex로 열 너비 비율을 정합니다.
 */
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './PolicyTable.styles';

interface PolicyTableProps {
  rows: string[][];
  columnFlex: number[];
}

const PolicyTable = ({ rows, columnFlex }: PolicyTableProps) => (
  <View style={styles.table}>
    {rows.map((row, r) => (
      <View key={r} style={styles.row}>
        {row.map((cell, c) => (
          <View
            key={c}
            style={[styles.cell, r === 0 && styles.headerCell, { flex: columnFlex[c] }]}
          >
            <Text style={[styles.cellText, r === 0 && styles.headerText]}>{cell}</Text>
          </View>
        ))}
      </View>
    ))}
  </View>
);

export default PolicyTable;
