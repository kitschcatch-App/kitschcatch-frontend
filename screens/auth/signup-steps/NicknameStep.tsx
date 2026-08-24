/**
 * 컴포넌트: 회원가입 - 닉네임 입력 스텝 (NicknameStep)
 * 역할: SignUpScreen 2번째 스텝에서 다른 사용자에게 보여질 닉네임을 입력받습니다.
 */
import React from 'react';
import { View, Text } from 'react-native';
import CommonInput from '../../../components/CommonInput';
import { colors } from '../../../styles/colors';
import { styles } from '../SignUpScreen.styles';

interface Props {
  value: string;
  onChange: (value: string) => void;
  showError?: boolean;
}

const NicknameStep = ({ value, onChange, showError }: Props) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepGuideText}>
      닉네임을 입력해주세요!<Text style={styles.requireText}> *</Text>
    </Text>
    <CommonInput
      placeholder="닉네임을 입력해주세요"
      value={value}
      onChangeText={onChange}
      maxLength={10}
      showCharCount
      currentLength={value.length}
      containerStyle={styles.stepInput}
      style={[styles.stepInputField, showError && styles.inputError]}
      placeholderTextColor={colors.gray07}
      warningText={showError ? '닉네임을 입력해주세요' : false}
      warningTextStyle={{ color: colors.error }}
    />
  </View>
);

export default NicknameStep;
