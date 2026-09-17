/**
 * 컴포넌트: 회원가입 - 한줄소개 입력 스텝 (BioStep)
 * 역할: SignUpScreen 4번째 스텝에서 프로필에 표시될 한줄소개를 입력받습니다.
 * 값을 입력해야 '다음' 버튼이 활성화되며, 입력 없이 넘어가려면 '건너뛰기'를 사용합니다.
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

const BioStep = ({ value, onChange, showError }: Props) => {
  const isMaxLength = value.length >= 24;
  const isEmpty = showError && value.trim().length === 0;
  const isErrorState = isEmpty || isMaxLength;
  const message = isEmpty ? '한줄소개를 입력해주세요' : isMaxLength ? '한줄소개는 24자로 입력해주세요' : '';

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepGuideText}>자신을 한줄로 소개해주세요!</Text>
      <CommonInput
        placeholder="한줄소개를 입력해주세요 (최대 24자)"
        value={value}
        onChangeText={onChange}
        maxLength={24}
        containerStyle={styles.stepInput}
        style={[styles.stepInputField, isErrorState && styles.inputError]}
        placeholderTextColor={colors.gray07}
      />
      <View style={styles.stepMetaRow}>
        <Text style={[styles.stepMessage, { color: isErrorState ? colors.error : colors.gray07 }]}>{message}</Text>
        <Text style={[styles.stepCharCounter, isMaxLength && styles.stepCharCounterMax]}>{`${value.length}/24`}</Text>
      </View>
    </View>
  );
};

export default BioStep;
