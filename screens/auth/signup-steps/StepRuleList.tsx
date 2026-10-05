/**
 * 컴포넌트: 회원가입 스텝 안내 규칙 목록 (StepRuleList)
 * 역할: 아이디/닉네임 등 입력 스텝에서 작성 규칙을 점(dot) 목록 형태로 보여줍니다.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../SignUpScreen.styles';

interface Props {
  rules: string[];
}

const StepRuleList = ({ rules }: Props) => (
  <View style={styles.stepRulesContainer}>
    {rules.map((rule, index) => (
      <View key={index} style={styles.stepRuleRow}>
        <Text style={styles.stepRuleDot}>{'•'}</Text>
        <Text style={styles.stepRuleText}>{rule}</Text>
      </View>
    ))}
  </View>
);

export default StepRuleList;
