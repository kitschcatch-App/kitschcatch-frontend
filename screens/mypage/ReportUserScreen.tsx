/**
 * 화면: 신고하기 (ReportUserScreen)
 * 역할: 차단하기 화면의 '신고하고 차단하기'를 눌렀을 때, 신고 사유를 선택하는 화면입니다.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './ReportUserScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';
import CommonDropdown from '../../components/CommonDropdown';
import { reportAPI, ReportTargetType } from '../../api/apiClient';

type Props = NativeStackScreenProps<RootStackParamList, 'ReportUser'>;

const PLACEHOLDER = '신고사유 선택';

type Reason = { code: string; label: string };

const ReportUserScreen = ({ navigation, route }: Props) => {
  const [reason, setReason] = useState(PLACEHOLDER);
  const [expanded, setExpanded] = useState(false);
  const selected = reason !== PLACEHOLDER;
  const { target } = route.params;
  const isProduct = target === 'product';
  const targetType: ReportTargetType = isProduct ? 'POST' : target === 'chat' ? 'CHAT_ROOM' : 'USER';
  const targetId = route.params.targetId ?? route.params.userId;
  const [reasons, setReasons] = useState<Reason[]>([]);

  // 신고 사유는 대상 종류별로 서버에서 조회
  useEffect(() => {
    reportAPI
      .getReasons(targetType)
      .then(res => setReasons(res.data.data))
      .catch(e => console.error('신고 사유 조회 실패:', e));
  }, [targetType]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScreenHeader title="신고하기" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.title}>{isProduct ? '이 상품을 신고할까요?' : '이 사용자를 신고할까요?'}</Text>
          <Text style={styles.subtitle}>
            {isProduct
              ? '키치캐치 운영정책을 위반했다고 생각되는 이유를 선택해 주세요. 신고 내용은 검토 목적으로만 사용되며 판매자에게 신고자의 정보가 공개되지 않습니다.'
              : '운영정책을 위반한 행위가 있었다면 신고 사유를 선택해 주세요. 신고자 정보는 신고 대상 사용자에게 공개되지 않습니다.'}
          </Text>
        </View>

        <CommonDropdown
          containerStyle={styles.dropdown}
          label=""
          value={reason}
          placeholder={PLACEHOLDER}
          options={reasons.map(r => r.label)}
          isExpanded={expanded}
          onToggle={() => setExpanded(prev => !prev)}
          onSelect={option => {
            setReason(option);
            setExpanded(false);
          }}
        />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
          activeOpacity={0.7}
          disabled={!selected}
          onPress={() => navigation.push('ReportDetail', {
              userId: route.params.userId,
              reason,
              reasonCode: reasons.find(r => r.label === reason)?.code ?? '',
              targetType,
              targetId,
              target,
              alsoBlock: route.params.alsoBlock,
            })}
        >
          <Text style={[styles.nextButtonText, !selected && styles.nextButtonTextDisabled]}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ReportUserScreen;
