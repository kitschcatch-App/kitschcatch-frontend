/**
 * 컴포넌트: 공용 입력창 (CommonInput)
 * 역할: 상품 등록 폼 등에서 텍스트를 입력받을 때 재사용할 수 있는 범용 TextInput 컴포넌트입니다.
 */
import React from 'react';
import { View, Text, TextInput, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { styles } from './CommonInput.styles';

interface CommonInputProps extends TextInputProps {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  showCharCount?: boolean;
  currentLength?: number;
  warningText?: string | false;
}

const CommonInput = ({
  label,
  containerStyle,
  showCharCount,
  currentLength = 0,
  warningText,
  ...textInputProps
}: CommonInputProps) => {
  const { maxLength } = textInputProps;

  return (
    <View style={containerStyle}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput style={styles.textInput} {...textInputProps} />
      
      {showCharCount && maxLength && (
        <Text style={[styles.charCounter, currentLength >= maxLength && styles.charCounterMax]}>
          {`${currentLength}/${maxLength}`}
        </Text>
      )}
      {warningText ? <Text style={styles.warningText}>{warningText}</Text> : null}
    </View>
  );
};

export default CommonInput;