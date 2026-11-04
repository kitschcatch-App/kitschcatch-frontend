/**
 * 화면: 결제 한도 및 통신사 정책 (PaymentLimitPolicyScreen)
 * 역할: 약관 및 정책 목록에서 진입하여 결제 한도 및 통신사 정책 전문을 보여주는 화면입니다.
 * 스타일은 SafePaymentTermsScreen과 공유합니다.
 */
import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from '../payment/SafePaymentTermsScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentLimitPolicy'>;

type Section = { title: string; lines: string[] };

const SECTIONS: Section[] = [
  {
    title: '제1조 결제 한도',
    lines: [
      '실제 결제 가능 금액은 키치캐치 한도, PG사 한도, 카드사·통신사 한도 및 회원의 잔여 한도 중 가장 낮은 금액을 적용합니다.',
      '서비스 초기 권장 한도는 카드 결제 기준 건당 100만원, 1일 200만원, 월 500만원입니다.',
      '고가 상품, 신규 회원, 비정상적인 결제 시도 또는 결제도용 위험이 높은 거래는 추가 인증이나 한도 축소를 적용할 수 있습니다.',
      '한도를 변경할 경우 결제 화면에 적용 한도를 표시합니다. 이미 체결된 거래에는 불리하게 소급 적용하지 않습니다.',
      '한도를 회피하기 위한 주문 분할, 타인 명의 결제 또는 현금화 거래는 제한할 수 있습니다.',
    ],
  },
  {
    title: '제2조 휴대폰 결제',
    lines: [
      '휴대폰 결제 한도는 통신사, 이용자 연령, 가입기간, 요금 연체 여부, 명의 상태 및 이용자가 직접 설정한 한도에 따라 달라집니다.',
      '법인폰, 선불폰, 일부 알뜰폰, 미성년자 명의 회선 및 이용정지 회선은 결제가 제한될 수 있습니다.',
      '키치캐치는 통신사가 설정한 한도를 상향하거나 초기화할 수 없습니다.',
      '결제월과 같은 달에 취소하면 통신사 한도가 복원될 수 있습니다. 결제월이 지난 뒤 취소하면 통신사 정책에 따라 계좌 환불로 처리되거나 한도가 복원되지 않을 수 있습니다.',
      '휴대폰 결제 이용요금은 통신요금에 합산 청구되며, 통신요금을 미납하면 통신사 정책에 따른 제한이나 연체처리가 발생할 수 있습니다.',
      '휴대폰 결제가 거절된 경우 구체적인 사유와 한도는 해당 통신사 또는 결제대행사를 통해 확인해야 합니다.',
      '키치캐치가 휴대폰 결제를 실제로 도입하기 전에는 본 조항을 약관에 노출하지 않는 편이 적절합니다.',
    ],
  },
];

const PaymentLimitPolicyScreen = ({ navigation }: Props) => (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <ScreenHeader title="결제 한도 및 통신사 정책" onBack={() => navigation.goBack()} />

    <ScrollView
      style={styles.scrollContent}
      contentContainerStyle={styles.scrollContentInner}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>결제 한도 및 통신사 정책</Text>
        <Text style={styles.registeredDate}>2026.08.12 10:41</Text>
      </View>

      {SECTIONS.map(section => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionBody}>
            {section.lines.map((text, i) => (
              <View key={i} style={styles.lineRow}>
                <Text style={[styles.lineMarker, styles.markerNumber]}>{i + 1}.</Text>
                <Text style={styles.lineText}>{text}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  </SafeAreaView>
);

export default PaymentLimitPolicyScreen;
