/**
 * 화면: 푸시 알림 및 앱 내 알림 정책 (NotificationPolicyScreen)
 * 역할: 약관 및 정책 목록에서 진입하여 푸시 알림 및 앱 내 알림 정책 전문을 보여주는 화면입니다.
 * 스타일은 SafePaymentTermsScreen과 공유합니다.
 */
import React from 'react';
import { Text, View, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from '../payment/SafePaymentTermsScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationPolicy'>;

// marker가 없으면 일반 문단, '•'은 불릿, '1.' 등은 번호 줄, link는 문장 끝에 붙는 밑줄 링크
type Line = { marker?: string; text: string; link?: { text: string; url: string } };
type Section = { title: string; lines: Line[] };

const ordered = (items: string[]): Line[] =>
  items.map((text, i) => ({ marker: `${i + 1}.`, text }));
const bullet = (items: string[]): Line[] => items.map(text => ({ marker: '•', text }));

const NETWORK_ACT_URL =
  'https://law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1025057501';

const SECTIONS: Section[] = [
  {
    title: '제1조 알림 구분',
    lines: [
      { text: '알림은 거래 알림, 서비스 알림, 마케팅 알림으로 구분합니다.' },
      ...bullet([
        '거래 알림은 결제 완료, 판매자 발송 요청, 배송 시작·완료, 구매 확정 예정, 취소·환불, 정산, 분쟁 처리와 관련된 알림입니다.',
        '서비스 알림은 약관 변경, 개인정보 유출, 보안 경고, 서비스 장애와 같이 회원 권익에 영향을 주는 알림입니다.',
        '마케팅 알림은 상품 추천, 이벤트, 할인, 광고, 재방문 유도와 관련된 알림입니다.',
      ]),
    ],
  },
  {
    title: '제2조 발송 원칙',
    lines: [
      ...ordered([
        '거래 및 서비스 알림은 계약 이행과 회원 보호를 위해 마케팅 수신 동의와 별도로 발송할 수 있습니다.',
        '마케팅 알림은 회원의 명시적인 사전 동의를 받은 경우에만 발송합니다.',
        '회원이 마케팅 수신 동의를 철회하면 즉시 반영하며, 거래 및 필수 서비스 알림에는 영향을 주지 않습니다.',
        '마케팅 알림 설정은 앱에서 언제든지 변경할 수 있어야 합니다.',
        '광고성 정보는 발신자와 광고 목적을 명확히 표시하고, 수신거부 방법을 함께 제공합니다.',
      ]),
      {
        marker: '6.',
        text:
          '오후 9시부터 다음 날 오전 8시까지는 별도의 야간 광고 수신 동의를 받지 않는 한 마케팅 알림을 발송하지 않습니다. ',
        link: { text: '정보통신망법 제50조', url: NETWORK_ACT_URL },
      },
      {
        marker: '7.',
        text: '마케팅 수신 동의 여부는 동의일로부터 2년마다 확인하고 그 결과를 안내합니다.',
      },
    ],
  },
  {
    title: '제3조 알림 보관',
    lines: ordered([
      '앱 내 일반 알림은 발송일로부터 90일 동안 제공합니다.',
      '거래, 환불, 분쟁 및 정산 관련 알림은 앱 화면에서 삭제되더라도 관련 거래기록과 함께 법정기간 동안 내부 증빙으로 보관할 수 있습니다.',
      '푸시 알림 미수신만으로 거래기한이 자동 연장되지는 않습니다. 중요한 기한은 주문 상세 화면에도 표시하고, 가능한 경우 앱 내 알림과 이메일 또는 문자 등 보조 수단을 사용합니다.',
      '잠금화면에는 상품명이나 거래금액 등 민감할 수 있는 정보를 최소한으로 표시합니다.',
    ]),
  },
];

const renderLine = ({ marker, text, link }: Line, key: number) => {
  const body = (
    <Text style={styles.lineText}>
      {text}
      {link && (
        <Text style={styles.link} onPress={() => Linking.openURL(link.url)}>
          {link.text}
        </Text>
      )}
    </Text>
  );
  if (!marker) {
    return <View key={key}>{body}</View>;
  }
  return (
    <View key={key} style={styles.lineRow}>
      <Text style={[styles.lineMarker, marker === '•' ? styles.markerBullet : styles.markerNumber]}>
        {marker}
      </Text>
      {body}
    </View>
  );
};

const NotificationPolicyScreen = ({ navigation }: Props) => (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <ScreenHeader title="푸시 알림 및 앱 내 알림 정책" onBack={() => navigation.goBack()} />

    <ScrollView
      style={styles.scrollContent}
      contentContainerStyle={styles.scrollContentInner}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>푸시 알림 및 앱 내 알림 정책</Text>
        <Text style={styles.registeredDate}>2026.08.12 10:41</Text>
      </View>

      {SECTIONS.map(section => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionBody}>{section.lines.map(renderLine)}</View>
        </View>
      ))}
    </ScrollView>
  </SafeAreaView>
);

export default NotificationPolicyScreen;
