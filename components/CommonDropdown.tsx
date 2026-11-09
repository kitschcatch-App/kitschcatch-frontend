/**
 * 컴포넌트: 공용 드롭다운 (CommonDropdown)
 * 역할: 사용감, 카테고리 등 여러 옵션 중 하나를 선택할 때 재사용할 수 있는 범용 아코디언 드롭다운 컴포넌트입니다.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { styles } from './CommonDropdown.styles';

interface CommonDropdownProps {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  isExpanded: boolean;
  onToggle: () => void;
  onSelect: (option: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}

const CommonDropdown = ({
  label,
  value,
  options,
  placeholder,
  isExpanded,
  onToggle,
  onSelect,
  containerStyle,
  buttonStyle,
}: CommonDropdownProps) => {
  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
      <TouchableOpacity style={[styles.conditionDropdownButton, buttonStyle]} onPress={onToggle}>
        <Text style={[styles.conditionDropdownText, value !== placeholder && styles.conditionDropdownTextSelected]}>
          {value}
        </Text>
        <Text style={styles.conditionDropdownIcon}>▼</Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.dropdownContent}>
          {options.map((option) => (
            <TouchableOpacity key={option} style={styles.dropdownOptionButton} onPress={() => onSelect(option)}>
              <Text style={[styles.dropdownOptionText]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default CommonDropdown;