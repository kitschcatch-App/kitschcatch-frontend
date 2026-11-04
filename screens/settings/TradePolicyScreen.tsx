/**
 * 화면: 구매 확정, 취소, 환불 및 정산 정책 (TradePolicyScreen)
 * 역할: 약관 및 정책 목록에서 진입하여 구매 확정·취소·환불·정산 정책 전문을 보여주는 화면입니다.
 * 스타일은 SafePaymentTermsScreen과 공유합니다.
 */
import React from 'react';
import { Text, View, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from '../payment/SafePaymentTermsScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'TradePolicy'>;

// link는 문장 끝에 붙는 밑줄 링크
type Line = { marker: string; text: string; link?: { text: string; url: string } };
type Section = { title: string; lines: Line[] };

const ordered = (items: string[]): Line[] =>
  items.map((text, i) => ({ marker: `${i + 1}.`, text }));

// 링크가 붙는 항목(번호는 1부터)을 지정해 번호 줄을 만든다
const orderedWithLinks = (
  items: string[],
  links: Record<number, { text: string; url: string }>,
): Line[] =>
  ordered(items).map((line, i) => (links[i + 1] ? { ...line, link: links[i + 1] } : line));

const ACT_17_URL =
  'https://law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1022341977';
const ACT_18_URL =
  'https://law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0018&lsiSeq=282793&urlMode=lsScJoRltInfoR';

const SECTIONS: Section[] = [
  {
    title: '제1조 거래당사자',
    lines: ordered([
      '키치캐치는 회원 간 거래를 위한 통신판매중개자이며, 원칙적으로 상품의 판매 당사자가 아닙니다.',
      '상품 설명, 품질, 권리 보유 여부 및 배송에 대한 책임은 판매자에게 있습니다.',
      '키치캐치는 결제 보호, 분쟁 접수, 정산 보류 및 제재 등의 방법으로 안전한 거래를 지원합니다.',
      '키치캐치가 직접 판매하는 상품은 별도의 직매입 판매정책을 적용합니다.',
    ]),
  },
  {
    title: '제2조 판매자의 배송 의무',
    lines: ordered([
      '판매자는 결제 완료일부터 3영업일 이내에 상품을 발송하고 유효한 배송정보를 등록해야 합니다.',
      '기한 내 발송하지 않으면 구매자는 주문을 취소할 수 있습니다.',
      '결제 완료일부터 5영업일까지 발송되지 않으면 주문을 자동 취소하고 구매자에게 전액 환불하는 것을 기본으로 합니다.',
      '예약상품 등 별도 발송일이 있는 경우에는 결제 전에 예상 발송일을 명확히 고지해야 합니다.',
    ]),
  },
  {
    title: '제3조 구매 확정',
    lines: ordered([
      '구매자는 상품을 수령하고 상태를 확인한 뒤 구매를 확정할 수 있습니다.',
      '구매자가 직접 확정하지 않으면 배송완료 시점부터 7일 후 자동으로 구매 확정됩니다.',
      '자동 확정 예정일은 주문 상세 화면에 표시하고, 최소 2회 이상 사전 알림을 발송합니다.',
      '반품, 환불 또는 분쟁이 접수된 주문은 자동 구매 확정과 판매자 정산을 중지합니다.',
      '배송추적이 불가능하거나 배송완료 여부가 불명확한 주문은 자동 확정하지 않고 별도 확인합니다.',
      '구매 확정 이후에는 단순 변심에 따른 취소가 제한됩니다. 다만 미고지 하자, 위조품, 도난품, 오배송 또는 판매자의 고의적인 허위 설명에 대한 권리는 구매 확정 후에도 보호합니다.',
    ]),
  },
  {
    title: '제4조 주문 취소',
    lines: ordered([
      '판매자가 발송하기 전에는 구매자가 즉시 취소할 수 있습니다.',
      '판매자가 이미 정상적으로 발송한 경우에는 취소가 아닌 반품 절차를 적용합니다.',
      '품절, 판매자의 판매 거부 또는 발송기한 초과로 취소되는 경우 구매자에게 전액 환불합니다.',
      '결제도용, 명백한 가격 오류, 금지상품 또는 시스템 오류가 확인되면 회사가 주문을 취소할 수 있습니다. 이 경우 사유를 알리고 결제금액 전액을 환불합니다.',
    ]),
  },
  {
    title: '제5조 반품 및 환불',
    lines: orderedWithLinks(
      [
        '구매자는 원칙적으로 상품을 받은 날부터 7일 이내에 반품을 신청할 수 있습니다.',
        '상품이 설명·광고와 다르거나 계약 내용과 다르게 이행된 경우에는 수령일부터 3개월 이내이면서 그 사실을 안 날부터 30일 이내에 신청할 수 있습니다. ',
        '단순 변심 반품의 왕복 배송비는 구매자가 부담합니다.',
        '하자, 위조품, 오배송, 구성품 누락 또는 설명과 현저히 다른 상품의 반품 비용은 판매자가 부담합니다.',
        '배송 과정에서 발생한 파손은 배송상태와 포장 책임을 확인해 판매자 또는 배송사업자가 부담합니다.',
        '상품 확인에 필요한 수준을 넘어 사용하거나 훼손해 가치가 감소한 경우에는 반품이 제한되거나 감소한 가치만큼 환불액이 조정될 수 있습니다.',
        '배송용 외부 포장을 개봉했다는 이유만으로 반품을 거절할 수 없습니다.',
        '위조품, 도난품 또는 거래금지 상품으로 확인되면 전액 환불하고 판매자를 이용 제한할 수 있습니다.',
        '반품 상품 수령 또는 취소 확정 후 3영업일 이내에 PG사에 환불을 요청합니다. 실제 카드 승인 취소 시점은 카드사 사정에 따라 달라질 수 있습니다. 법률상 환급 원칙도 반환일 등을 기준으로 3영업일 이내입니다. ',
      ],
      {
        2: { text: '전자상거래법 제17조', url: ACT_17_URL },
        9: { text: '전자상거래법 제18조', url: ACT_18_URL },
      },
    ),
  },
  {
    title: '제6조 분쟁 처리',
    lines: ordered([
      '분쟁이 접수되면 판매자 정산과 자동 구매 확정을 즉시 중지합니다.',
      '당사자는 상품 사진, 포장 영상, 송장, 대화 내용 등 객관적인 자료를 제출해야 합니다.',
      '회사는 접수 후 3영업일 이내에 진행 상황을 안내하고, 원칙적으로 10영업일 이내에 처리방안 또는 추가 조사 필요성을 알립니다.',
      '사실관계 확인이 불가능하면 배송기록, 상품 설명, 당사자의 귀책 정도와 제출 자료를 종합해 결정합니다.',
      '회사의 중재로 해결되지 않으면 한국소비자원 분쟁조정 또는 민사절차를 이용할 수 있습니다.',
    ]),
  },
  {
    title: '제7조 판매자 정산',
    lines: ordered([
      '구매 확정 전까지 결제대금은 판매자에게 지급하지 않습니다.',
      '정상 거래는 구매 확정일부터 2영업일 이내에 정산하는 것을 기본으로 합니다.',
      '정산금은 판매대금과 판매자에게 귀속되는 배송비에서 서비스 수수료, 판매자 부담 환불금 및 사전에 고지된 비용을 차감해 계산합니다.',
      '정산은 본인 인증이 완료된 판매자 명의 계좌로만 지급합니다.',
      '계좌정보 오류, 휴면계좌, 명의 불일치 또는 금융기관 점검으로 지급이 지연될 수 있습니다.',
      '결제도용, 사기 의심, 위조품 신고, 반복적인 거래 분쟁 등 객관적인 사유가 있으면 필요한 금액 범위에서 정산을 보류할 수 있습니다.',
      '일반적인 정산 검토는 최대 30일 이내에 마쳐야 하며, 보류 사유와 예상 처리일을 판매자에게 안내합니다. 수사기관 또는 금융기관의 요청이 있는 경우에는 해당 절차가 종료될 때까지 연장할 수 있습니다.',
      '정산 완료 후 판매자의 책임으로 환불이 발생하면 판매자는 해당 금액을 반환해야 하며, 회사는 동의를 받은 약관에 따라 향후 정산금에서 상계할 수 있습니다.',
    ]),
  },
];

const renderLine = ({ marker, text, link }: Line, key: number) => (
  <View key={key} style={styles.lineRow}>
    <Text style={[styles.lineMarker, styles.markerNumber]}>{marker}</Text>
    <Text style={styles.lineText}>
      {text}
      {link && (
        <Text style={styles.link} onPress={() => Linking.openURL(link.url)}>
          {link.text}
        </Text>
      )}
    </Text>
  </View>
);

const TradePolicyScreen = ({ navigation }: Props) => (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <ScreenHeader title="구매 확정, 취소, 환불 및 정산 정책" onBack={() => navigation.goBack()} />

    <ScrollView
      style={styles.scrollContent}
      contentContainerStyle={styles.scrollContentInner}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>구매 확정, 취소, 환불 및 정산 정책</Text>
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

export default TradePolicyScreen;
