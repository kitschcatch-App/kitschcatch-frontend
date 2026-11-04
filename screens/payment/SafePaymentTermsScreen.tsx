/**
 * 화면: 안심결제 서비스 이용약관 (SafePaymentTermsScreen)
 * 역할: 결제 화면에서 진입하여 안심결제 서비스 이용약관 전문을 보여주는 화면입니다.
 */
import React from 'react';
import { Text, View, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './SafePaymentTermsScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'SafePaymentTerms'>;

// marker: 줄 앞 번호/불릿, link: 문장 끝에 붙는 밑줄 링크
type Line = { marker?: string; text: string; link?: { text: string; url: string } };
type Section = { title: string; lines: Line[] };

const ordered = (items: string[]): Line[] =>
  items.map((text, i) => ({ marker: `${i + 1}.`, text }));
const bullet = (items: string[]): Line[] => items.map(text => ({ marker: '•', text }));

const SECTIONS: Section[] = [
  {
    title: '제1조 목적',
    lines: [
      {
        text:
          '본 약관은 키치캐치 안심결제 서비스 이용과 관련하여 회사, 구매자 및 판매자의 권리·의무와 거래 절차를 정하는 것을 목적으로 합니다.',
      },
    ],
  },
  {
    title: '제2조 역할',
    lines: [
      ...ordered([
        '회사는 회원 간 거래, 주문상태 및 분쟁 처리를 관리합니다.',
        '결제 승인, 대금보관, 환불 및 지급대행은 회사와 계약한 전자금융업자가 수행합니다.',
        '회사는 회원의 결제대금을 일반 운영계좌에 직접 보관하지 않습니다.',
        '이용자는 결제 과정에서 전자금융업자의 약관에 별도로 동의해야 합니다.',
      ]),
      {
        text:
          '전자금융거래의 주체는 금융회사 또는 전자금융업자이므로 키치캐치 자체 약관은 전자금융 기본약관이 아니라 플랫폼 안심결제 규정으로 두어야 합니다. ',
        link: {
          text: '전자금융거래법상 정의',
          url:
            'https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsId=000798&lsJoLnkSeq=900615239',
        },
      },
    ],
  },
  {
    title: '제3조 이용료',
    lines: ordered([
      '안심결제 이용료는 상품금액과 배송비 합계의 5.5%입니다.',
      '최소 이용료는 800원입니다.',
      '계산 결과는 원 단위로 반올림합니다.',
      '이용료는 구매자가 부담하며 부가세가 포함됩니다.',
      '회사는 결제 전에 상품금액, 배송비, 이용료 및 최종 결제금액을 구분해 표시합니다.',
    ]),
  },
  {
    title: '제4조 지원 결제수단',
    lines: bullet([
      '신용·체크카드.',
      '실시간 계좌이체.',
      '가상계좌·무통장입금.',
      '회사와 결제대행사가 별도로 지원하기로 한 결제수단.',
    ]),
  },
  {
    title: '제5조 가상계좌',
    lines: ordered([
      '주문별로 전용 가상계좌를 발급합니다.',
      '입금기한은 발급 시점부터 24시간입니다.',
      '기한 내 입금하지 않으면 주문을 자동 취소합니다.',
      '기한 후 접수된 입금은 주문을 복구하지 않고 확인 후 환불합니다.',
      '가상계좌와 직접 무통장입금은 별도 결제수단으로 제공하지 않습니다.',
    ]),
  },
  {
    title: '제6조 대금보관 및 구매 확정',
    lines: [
      ...ordered([
        '결제대금은 구매 확정 전까지 결제대행사가 보관합니다.',
        '구매자가 상품을 확인하고 구매를 확정하면 판매자 정산을 시작합니다.',
        '반품·환불·분쟁이 접수되면 자동 구매 확정과 판매자 정산을 중지합니다.',
        '구매자가 별도 조치를 하지 않으면 배송완료 후 7일째 자동 구매 확정합니다.',
      ]),
      {
        text:
          '단, 토스페이먼츠 표준 에스크로의 자동 구매확정 시점과 키치캐치의 7일 정책이 일치하는지는 계약 전에 반드시 확인해야 합니다. 일치하지 않으면 약관과 시스템을 PG 계약기준에 맞춰 동시에 수정해야 합니다.',
      },
    ],
  },
  {
    title: '제7조 판매자 발송',
    lines: ordered([
      '판매자는 결제 완료일부터 3영업일 이내에 상품을 발송해야 합니다.',
      '운송장 등록만으로 발송한 것으로 보지 않으며 택배사 집하를 기준으로 합니다.',
      '3영업일 내 집하되지 않으면 구매자가 취소할 수 있습니다.',
      '5영업일까지 집하되지 않으면 주문을 자동 취소할 수 있습니다.',
    ]),
  },
  {
    title: '제8조 취소 및 환불',
    lines: ordered([
      '집하 전 취소 시 상품금액, 배송비 및 안심결제 이용료를 전액 환불합니다.',
      '판매자 미발송 또는 판매자 귀책으로 거래가 취소되면 전액 환불합니다.',
      '부분 환불 시 환불 비율에 따라 안심결제 이용료를 환불합니다.',
      '결제대행사 처리시간에 따라 카드 승인 취소나 계좌 환급이 지연될 수 있습니다.',
      '가상계좌와 계좌이체의 원거래 수수료가 결제대행사로부터 반환되지 않더라도 회사가 이용자에게 약정한 환불금은 환불정책에 따라 처리합니다.',
    ]),
  },
  {
    title: '제9조 판매자 정산',
    lines: ordered([
      '판매자 수수료는 부과하지 않습니다.',
      '판매자 정산금은 상품금액과 판매자에게 귀속되는 배송비의 합계입니다.',
      '구매 확정일부터 2영업일 이내 지급을 원칙으로 합니다.',
      '분쟁, 본인확인 미완료, 계좌 명의 불일치 또는 부정거래가 의심되면 정산을 보류할 수 있습니다.',
    ]),
  },
  {
    title: '제10조 외부 거래',
    lines: [
      {
        text:
          '키치캐치 밖의 계좌이체, 현금거래 또는 외부 결제링크를 이용한 거래에는 안심결제를 적용하지 않습니다. 회사는 해당 거래의 환불이나 피해보상을 지원하지 않을 수 있습니다.',
      },
    ],
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

const SafePaymentTermsScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="안심결제 서비스 이용약관" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>안심결제 서비스 이용약관</Text>
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
};

export default SafePaymentTermsScreen;
