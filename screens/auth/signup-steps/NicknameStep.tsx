/**
 * 컴포넌트: 회원가입 - 닉네임 입력 스텝 (NicknameStep)
 * 역할: SignUpScreen 2번째 스텝에서 다른 사용자에게 보여질 닉네임을 입력받고 중복 확인을 진행합니다.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CommonInput from '../../../components/CommonInput';
import { colors } from '../../../styles/colors';
import { styles } from '../SignUpScreen.styles';
import StepRuleList from './StepRuleList';

interface Props {
  value: string;
  onChange: (value: string) => void;
  showError?: boolean;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const NICKNAME_MAX_LENGTH = 12;
const NICKNAME_MIN_LENGTH = 2;
// TODO: 실제 금칙어/운영진 사칭 판별은 백엔드 정책에 맞춰 서버에서 최종 검증
const BANNED_NICKNAMES = ['관리자', '운영자', 'admin', 'administrator', 'staff', 'official', 'kitschcatch'];

const NICKNAME_RULES = [
  '2~12자로 입력해주세요.',
  '한글,영문, 숫자를 사용할 수 있습니다.',
  '공백, 특수문자, 이모지는 사용할 수 없습니다.',
  '중복된 닉네임은 사용할 수 없습니다.',
  '영문 대소문자만 다른 경우에도 동일한 닉네임으로 처리됩니다.',
  '닉네임은 회원정보에서 변경할 수 있으며, 변경 시 중복 여부를 확인합니다.',
  '욕설, 혐오 표현, 운영진 사칭 등 운영 정책에 위반되는 닉네임은 제한될 수 있습니다.',
  '중복된 닉네임 입력 시 숫자가 자동으로 추가되지 않습니다.',
];

const validateNicknameFormat = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed.length < NICKNAME_MIN_LENGTH || trimmed.length > NICKNAME_MAX_LENGTH) {
    return '닉네임은 2~12자로 입력해 주세요.';
  }
  if (!/^[가-힣a-zA-Z0-9]+$/.test(trimmed)) return '닉네임에는 한글, 영문, 숫자만 사용할 수 있어요.';
  // 대소문자만 다른 닉네임도 동일하게 취급
  const normalized = trimmed.toLowerCase();
  if (BANNED_NICKNAMES.some(word => normalized.includes(word))) {
    return '사용할 수 없는 닉네임이에요. 다른 이름을 입력해 주세요.';
  }
  return '';
};

const NicknameStep = ({ value, onChange, showError, isChecked, onCheckedChange }: Props) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState('');

  const formatError = validateNicknameFormat(value);

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
      setCheckMessage('닉네임을 입력해주세요');
      return;
    }
    if (formatError) return;

    setIsChecking(true);
    setCheckMessage('');
    try {
      // TODO: 닉네임 중복확인 API 연동 (영문 대소문자 구분 없이 비교)
      const isDuplicate = false;
      onCheckedChange(!isDuplicate);
      setCheckMessage(isDuplicate ? '이미 사용 중인 닉네임이에요. 다른 닉네임을 입력해 주세요.' : '사용 가능한 닉네임입니다');
    } finally {
      setIsChecking(false);
    }
  };

  const errorMessage = formatError || checkMessage || (showError ? '닉네임을 입력해주세요' : '');
  const isErrorMessage = !!formatError || (!!checkMessage && !isChecked);
  const messageColor = isErrorMessage ? colors.error : colors.gray07;

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepGuideText}>
        닉네임을 입력해주세요!<Text style={styles.requireText}> *</Text>
      </Text>

      <View style={styles.stepInputRow}>
        <CommonInput
          placeholder="ex.키치러버"
          value={value}
          onChangeText={handleChange}
          maxLength={NICKNAME_MAX_LENGTH}
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
        <Text style={[styles.stepMessage, { color: messageColor }]}>{errorMessage}</Text>
        <Text
          style={[
            styles.stepCharCounter,
            (value.length >= NICKNAME_MAX_LENGTH || isErrorMessage) && styles.stepCharCounterMax,
          ]}
        >
          {`${value.length}/${NICKNAME_MAX_LENGTH}`}
        </Text>
      </View>

      <StepRuleList rules={NICKNAME_RULES} />
    </View>
  );
};

export default NicknameStep;
