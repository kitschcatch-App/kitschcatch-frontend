/**
 * 컴포넌트: 회원가입 - 닉네임 입력 스텝 (NicknameStep)
 * 역할: SignUpScreen 2번째 스텝에서 다른 사용자에게 보여질 닉네임을 입력받고 중복 확인을 진행합니다.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CommonInput from '../../../components/CommonInput';
import { colors } from '../../../styles/colors';
import { styles } from '../SignUpScreen.styles';
import { userAPI } from '../../../api/apiClient';

interface Props {
  value: string;
  onChange: (value: string) => void;
  showError?: boolean;
  onVerifiedChange: (verified: boolean) => void;
}

type CheckResult = 'idle' | 'available' | 'duplicate' | 'error';

const NicknameStep = ({ value, onChange, showError, onVerifiedChange }: Props) => {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CheckResult>('idle');

  const handleChangeText = (text: string) => {
    onChange(text);
    setResult('idle');
    onVerifiedChange(false);
  };

  const handleCheck = async () => {
    const nickname = value.trim();
    if (!nickname || checking) return;

    try {
      setChecking(true);
      await userAPI.checkNicknameAvailability(nickname);
      setResult('available');
      onVerifiedChange(true);
    } catch (e: any) {
      setResult(e?.response?.status === 409 ? 'duplicate' : 'error');
      onVerifiedChange(false);
    } finally {
      setChecking(false);
    }
  };

  const resultText =
    result === 'available'
      ? '사용 가능한 닉네임이에요'
      : result === 'duplicate'
        ? '이미 사용 중인 닉네임이에요'
        : result === 'error'
          ? '중복 확인에 실패했어요. 다시 시도해주세요'
          : false;

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepGuideText}>
        닉네임을 입력해주세요!<Text style={styles.requireText}> *</Text>
      </Text>
      <View style={styles.availabilityRow}>
        <CommonInput
          placeholder="닉네임을 입력해주세요"
          value={value}
          onChangeText={handleChangeText}
          maxLength={10}
          showCharCount
          currentLength={value.length}
          containerStyle={styles.availabilityInputContainer}
          style={[styles.stepInputField, showError && styles.inputError]}
          placeholderTextColor={colors.gray07}
          warningText={showError ? (value.trim() ? '닉네임 중복 확인을 해주세요' : '닉네임을 입력해주세요') : resultText}
          warningTextStyle={{ color: result === 'available' ? colors.sucess : colors.error }}
        />
        <TouchableOpacity
          style={[styles.checkButton, (!value.trim() || checking) && styles.checkButtonDisabled]}
          onPress={handleCheck}
          disabled={!value.trim() || checking}
          activeOpacity={0.8}
        >
          <Text style={styles.checkButtonText}>{checking ? '확인 중' : '중복확인'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NicknameStep;
