/**
 * 컴포넌트: 회원가입 단계 진행 바 (StepProgressBar)
 * 역할: SignUpScreen 헤더 아래에서 현재 몇 번째 스텝인지 숫자와 배경색으로 보여줍니다.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../SignUpScreen.styles';

interface Props {
  currentStep: number;
  totalSteps: number;
}

const StepProgressBar = ({ currentStep, totalSteps }: Props) => (
  <View style={styles.stepProgressContainer}>
    {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
      <View
        key={step}
        style={[
          styles.stepProgressItem,
          step === currentStep && styles.stepProgressItemActive,
          step < currentStep && styles.stepProgressItemCompleted,
        ]}
      >
        <Text style={styles.stepProgressText}>{step}</Text>
      </View>
    ))}
  </View>
);

export default StepProgressBar;
