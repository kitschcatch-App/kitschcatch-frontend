/**
 * 컴포넌트: 회원가입 - 아이디 입력 스텝 (UsernameStep)
 * 역할: SignUpScreen 1번째 스텝에서 로그인용 아이디를 입력받습니다.
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

const UsernameStep = ({ value, onChange, showError }: Props) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepGuideText}>
      아이디를 입력해주세요!<Text style={styles.requireText}> *</Text>
    </Text>
    <CommonInput
      placeholder="아이디를 입력해주세요"
      value={value}
      onChangeText={onChange}
      maxLength={20}
      autoCapitalize="none"
      autoCorrect={false}
      containerStyle={styles.stepInput}
      style={[styles.stepInputField, showError && styles.inputError]}
      placeholderTextColor={colors.gray07}
      warningText={showError ? '아이디를 입력해주세요' : false}
      warningTextStyle={{ color: colors.error }}
    />
  </View>
);

export default UsernameStep;
