/**
 * 화면: 신고하기 (ReportUserScreen)
 * 역할: 차단하기 화면의 '신고하고 차단하기'를 눌렀을 때, 신고 사유를 선택하는 화면입니다.
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './ReportUserScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';
import CommonDropdown from '../../components/CommonDropdown';

type Props = NativeStackScreenProps<RootStackParamList, 'ReportUser'>;

const PLACEHOLDER = '신고사유 선택';

const REPORT_REASONS = [
  '사기 또는 결제도용이 의심돼요.',
  '외부 거래나 직접 송금을 요구해요.',
  '욕설·비방·혐오 표현을 사용해요.',
  '협박하거나 반복적으로 연락해요.',
  '성희롱 또는 부적절한 메시지를 보냈어요.',
  '개인정보를 요구하거나 공개했어요.',
  '다른 사람을 사칭하고 있어요.',
  '스팸 또는 광고 메시지를 보내요.',
  '허위 신고나 부당한 환불을 요구해요.',
  '기타 사유가 있어요.',
];

const PRODUCT_REPORT_REASONS = [
  '판매가 금지된 상품이에요.',
  '상품 설명이 사실과 달라요.',
  '상품 사진이나 내용이 부적절해요.',
  '외부 거래나 직접 송금을 유도해요.',
  '사기가 의심돼요.',
  '중복 게시물 또는 스팸이에요.',
  '타인의 사진이나 콘텐츠를 도용했어요.',
  '기타 사유가 있어요.',
];

const ReportUserScreen = ({ navigation, route }: Props) => {
  const [reason, setReason] = useState(PLACEHOLDER);
  const [expanded, setExpanded] = useState(false);
  const selected = reason !== PLACEHOLDER;
  const { target } = route.params;
  const isProduct = target === 'product';

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
          options={isProduct ? PRODUCT_REPORT_REASONS : REPORT_REASONS}
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
          onPress={() => navigation.push('ReportDetail', { userId: route.params.userId, reason, target })}
        >
          <Text style={[styles.nextButtonText, !selected && styles.nextButtonTextDisabled]}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ReportUserScreen;
