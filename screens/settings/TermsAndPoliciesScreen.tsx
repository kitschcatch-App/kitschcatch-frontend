/**
 * 화면: 약관 및 정책 (TermsAndPoliciesScreen)
 * 역할: 설정의 '약관 및 정책'을 눌렀을 때 진입하며, 약관·정책 목록을 보여주고 구현된 문서 화면으로 이동시킵니다.
 */
import React from 'react';
import { Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import ScreenHeader from '../../components/ScreenHeader';
import NextIcon from '../../assets/next.svg';
import { styles } from './TermsAndPoliciesScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'TermsAndPolicies'>;

// route가 없는 항목은 아직 화면이 없는 정책이라 눌러도 이동하지 않는다.
const POLICIES: { title: string; route?: 'TermsOfService' | 'PrivacyConsent' | 'LocationTerms' | 'SafePaymentTerms' | 'ProhibitedItemsPolicy' | 'OperationPolicy' | 'IpPolicy' | 'WithdrawalPolicy' | 'NotificationPolicy' | 'TradePolicy' | 'PaymentLimitPolicy' | 'DepositPolicy' }[] = [
  { title: '서비스 이용약관', route: 'TermsOfService' },
  { title: '개인정보 수집 및 이용 동의', route: 'PrivacyConsent' },
  { title: '위치기반서비스 이용약관', route: 'LocationTerms' },
  { title: '판매금지상품 정책', route: 'ProhibitedItemsPolicy' },
  { title: '운영정책 및 제재 기준', route: 'OperationPolicy' },
  { title: '안심결제 서비스 이용약관', route: 'SafePaymentTerms' },
  { title: '지식재산권 및 정식 굿즈 정책', route: 'IpPolicy' },
  { title: '탈퇴 시 개인정보 및 서비스 이용기록 처리 정책', route: 'WithdrawalPolicy' },
  { title: '푸시 알림 및 앱 내 알림 정책', route: 'NotificationPolicy' },
  { title: '구매 확정, 취소, 환불 및 정산 정책', route: 'TradePolicy' },
  { title: '결제 한도 및 통신사 정책', route: 'PaymentLimitPolicy' },
  { title: '입금 확인 및 자동 취소 정책', route: 'DepositPolicy' },
];

const TermsAndPoliciesScreen = ({ navigation }: Props) => (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <ScreenHeader title="약관 및 정책" onBack={() => navigation.goBack()} />
    <ScrollView showsVerticalScrollIndicator={false}>
      {POLICIES.map(policy => (
        <TouchableOpacity
          key={policy.title}
          style={styles.item}
          activeOpacity={0.7}
          onPress={() => policy.route && navigation.navigate(policy.route)}
        >
          <Text style={styles.itemTitle}>{policy.title}</Text>
          <NextIcon width={7} height={20} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  </SafeAreaView>
);

export default TermsAndPoliciesScreen;
