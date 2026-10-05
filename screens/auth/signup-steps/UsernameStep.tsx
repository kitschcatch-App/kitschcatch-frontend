/**
 * 컴포넌트: 회원가입 - 아이디 입력 스텝 (UsernameStep)
 * 역할: SignUpScreen 1번째 스텝에서 로그인용 아이디를 입력받고 중복 확인을 진행합니다.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CommonInput from '../../../components/CommonInput';
import { colors } from '../../../styles/colors';
import { styles } from '../SignUpScreen.styles';
import StepRuleList from './StepRuleList';
import { userAPI } from '../../../api/apiClient';

interface Props {
  value: string;
  onChange: (value: string) => void;
  showError?: boolean;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const USERNAME_MAX_LENGTH = 20;
const USERNAME_MIN_LENGTH = 4;
// TODO: 실제 금칙어/운영진 사칭 판별은 백엔드 정책에 맞춰 서버에서 최종 검증
const BANNED_USERNAMES = ['admin', 'administrator', 'root', 'system', 'operator', 'moderator', 'kitschcatch'];

const USERNAME_RULES = [
  '4~20자로 입력해주세요.',
  '영문 소문자로 시작해야 합니다.',
  '영문 소문자, 숫자, _ 만 사용할 수 있습니다.',
  '공백, 한글, 대문자, 이모지 및 특수문자는 사용할 수 없습니다.',
  '중복된 아이디는 사용할 수 없습니다.',
  '욕설, 운영진 사칭 등 운영 정책에 위반되는 아이디는 제한될 수 있습니다.',
];

const validateUsernameFormat = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed.length < USERNAME_MIN_LENGTH || trimmed.length > USERNAME_MAX_LENGTH) {
    return '아이디는 4~20자로 입력해 주세요.';
  }
  if (!/^[a-z]/.test(trimmed)) return '아이디의 첫 글자는 영문 소문자로 입력해 주세요.';
  if (!/^[a-z0-9_]+$/.test(trimmed)) return '영문 소문자, 숫자, 밑줄(_)만 사용할 수 있어요.';
  if (BANNED_USERNAMES.some(word => trimmed.includes(word))) {
    return '사용할 수 없는 아이디예요. 다른 아이디를 입력해 주세요.';
  }
  return '';
};

const UsernameStep = ({ value, onChange, showError, isChecked, onCheckedChange }: Props) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState('');

  const formatError = validateUsernameFormat(value);

  const handleChange = (text: string) => {
    onChange(text);
    setCheckMessage('');
    onCheckedChange(false);
  };

  const handleCheckDuplicate = async () => {
    if (isChecking) return;

    const trimmed = value.trim();
    if (!trimmed) {
      onCheckedChange(false);
      setCheckMessage('아이디를 입력해주세요');
      return;
    }
    if (formatError) return;

    setIsChecking(true);
    setCheckMessage('');
    try {
      const response = await userAPI.checkUsernameAvailability(trimmed);
      const isAvailable = !!response.data?.data?.available;
      onCheckedChange(isAvailable);
      setCheckMessage(isAvailable ? '사용 가능한 아이디입니다' : '이미 사용 중인 아이디예요. 다른 아이디를 입력해 주세요.');
    } catch (err: any) {
      onCheckedChange(false);
      const errorCode = err.response?.data?.error?.code;
      setCheckMessage(
        errorCode === 'COMMON_001'
          ? '아이디 형식이 올바르지 않아요.'
          : '중복확인 중 오류가 발생했어요. 다시 시도해 주세요.',
      );
    } finally {
      setIsChecking(false);
    }
  };

  const errorMessage = formatError || checkMessage || (showError ? '아이디를 입력해주세요' : '');
  const isErrorMessage = !!formatError || (!!checkMessage && !isChecked);
  const displayMessage = errorMessage || '아이디는 설정 후 변경할 수 없어요. 신중하게 입력해 주세요.';
  const messageColor = isErrorMessage ? colors.error : colors.gray07;

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepGuideText}>
        아이디를 입력해주세요!<Text style={styles.requireText}> *</Text>
      </Text>

      <View style={styles.stepInputRow}>
        <CommonInput
          placeholder="ex.kitsch"
          value={value}
          onChangeText={handleChange}
          maxLength={USERNAME_MAX_LENGTH}
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.stepInputContainer}
          style={[styles.stepInputField, (showError || isErrorMessage) && styles.inputError]}
          placeholderTextColor={colors.gray07}
        />
        <TouchableOpacity
          style={[
            styles.duplicateButton,
            isChecking && styles.duplicateButtonDisabled,
            isChecked && styles.duplicateButtonChecked,
          ]}
          onPress={handleCheckDuplicate}
          activeOpacity={0.8}
          disabled={isChecking}
        >
          <Text style={[styles.duplicateButtonText, isChecked && styles.duplicateButtonTextChecked]}>
            {isChecking ? '확인 중...' : '중복확인'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stepMetaRow}>
        <Text style={[styles.stepMessage, { color: messageColor }]}>{displayMessage}</Text>
        <Text
          style={[
            styles.stepCharCounter,
            (value.length >= USERNAME_MAX_LENGTH || isErrorMessage) && styles.stepCharCounterMax,
          ]}
        >
          {`${value.length}/${USERNAME_MAX_LENGTH}`}
        </Text>
      </View>

      <StepRuleList rules={USERNAME_RULES} />
    </View>
  );
};

export default UsernameStep;
