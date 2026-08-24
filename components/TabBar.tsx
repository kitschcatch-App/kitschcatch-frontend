/**
 * 컴포넌트: 탭바 (TabBar)
 * 역할: 탭 목록 중 하나를 선택하는 공통 세그먼트 탭바입니다.
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './TabBar.styles';

interface Tab<T extends string> {
  key: T;
  label: string;
}

interface TabBarProps<T extends string> {
  tabs: Tab<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
}

function TabBar<T extends string>({ tabs, activeTab, onChange }: TabBarProps<T>) {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
          onPress={() => onChange(tab.key)}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default TabBar;
