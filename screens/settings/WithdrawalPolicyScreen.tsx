/**
 * 화면: 탈퇴 시 개인정보 및 서비스 이용기록 처리 정책 (WithdrawalPolicyScreen)
 * 역할: 약관 및 정책 목록에서 진입하여 탈퇴 시 개인정보·이용기록 처리 정책 전문을 보여주는 화면입니다.
 * 스타일은 SafePaymentTermsScreen과 공유합니다.
 */
import React from 'react';
import { Text, View, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from '../payment/SafePaymentTermsScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';
import PolicyTable from '../../components/PolicyTable';

type Props = NativeStackScreenProps<RootStackParamList, 'WithdrawalPolicy'>;

// marker가 없으면 일반 문단, '1.' 등은 번호 줄, link는 text 뒤에 붙는 밑줄 링크(after는 링크 뒤에 이어지는 글)
type Line = { marker?: string; text: string; link?: { text: string; url: string }; after?: string };
// table은 lines보다 먼저 그린다 (첫 행은 머리글)
type Section = { title: string; lines?: Line[]; table?: string[][] };

const ordered = (items: string[]): Line[] =>
  items.map((text, i) => ({ marker: `${i + 1}.`, text }));

const PRIVACY_LAW_URL =
  'https://www.law.go.kr/LSW/lsLinkCommonInfo.do?ancYnChk=&chrClsCd=010202&lsJoLnkSeq=1020398651';

const E_COMMERCE_DECREE_URL = 'https://law.go.kr/LSW/lumLsLinkPop.do?lspttninfSeq=63460';

const SECTIONS: Section[] = [
  {
    title: '제1조 회원 탈퇴',
    lines: ordered([
      '회원은 언제든지 앱의 회원 탈퇴 기능 또는 고객센터를 통해 탈퇴를 신청할 수 있습니다.',
      '진행 중인 주문, 반품, 환불, 분쟁 또는 미정산 금액이 있는 경우에도 탈퇴 신청은 접수합니다. 다만 해당 업무 처리에 필요한 최소 정보는 거래가 종료될 때까지 제한적으로 이용합니다.',
      '판매대금 등 회원에게 지급해야 할 금액은 탈퇴를 이유로 소멸시키지 않습니다. 회사는 정산 절차와 지급 방법을 별도로 안내합니다.',
      '탈퇴가 완료되면 로그인이 차단되고 판매 중인 게시물은 즉시 비공개 처리합니다.',
    ]),
  },
  {
    title: '제2조 개인정보 파기',
    lines: [
      ...ordered([
        '회원 프로필, 연락처, 배송지, 소셜 로그인 연동 정보, 마케팅 동의 정보, 기기 식별자 및 푸시 토큰은 탈퇴 처리 후 지체 없이 삭제합니다.',
        '전자적 파일은 복구할 수 없는 방식으로 삭제하고, 종이 문서는 파쇄하거나 소각합니다.',
        '백업 데이터는 서비스 운영 환경에서 즉시 분리하며, 백업 교체 주기에 따라 최대 30일 이내 삭제합니다. 백업 데이터는 장애 복구 목적 외에는 사용하지 않습니다.',
      ]),
      {
        marker: '4.',
        text:
          '다른 법령에 따라 보존해야 하는 정보는 일반 회원정보와 논리적으로 분리해 보관하고, 보존기간이 끝나면 즉시 파기합니다. 개인정보 보호법은 목적 달성 또는 보유기간 종료 시 지체 없는 파기와 법정 보존정보의 분리 보관을 요구합니다. ',
        link: { text: '개인정보 보호법 제21조', url: PRIVACY_LAW_URL },
      },
    ],
  },
  {
    title: '제3조 법정 보존 기록',
    table: [
      ['기록', '보존기간'],
      ['계약 또는 청약철회에 관한 기록', '5년'],
      ['대금결제 및 상품 공급에 관한 기록', '5년'],
      ['소비자 불만 및 분쟁처리에 관한 기록', '3년'],
      ['표시·광고에 관한 기록', '6개월'],
      ['부정 이용 조사에 필요한 접속·보안 기록', '3개월'],
      ['세금계산서 및 정산 증빙', '관련 세법상 보존기간'],
    ],
    lines: [
      {
        text: '전자상거래 거래기록의 구체적인 보존기간은 ',
        link: { text: '전자상거래법 시행령 제6조', url: E_COMMERCE_DECREE_URL },
        after: '를 기준으로 합니다.',
      },
    ],
  },
  {
    title: '제4조 게시물과 대화 기록',
    lines: ordered([
      '판매 게시물은 탈퇴 시 비공개 처리합니다.',
      '거래와 무관한 게시물과 댓글은 작성자 정보를 탈퇴 회원으로 익명화합니다. 회원이 삭제를 요청하면 법적 보존 필요성이 없는 범위에서 삭제합니다.',
      '거래 대화는 사기 방지와 분쟁 처리를 위해 해당 거래기록의 보존기간 동안 제한적으로 보관할 수 있습니다. 상대방 화면에서는 이름과 프로필을 탈퇴 회원으로 표시합니다.',
      '구매 후기 역시 작성자를 익명화하되, 분쟁이나 권리침해가 확인되면 삭제할 수 있습니다.',
    ]),
  },
  {
    title: '제5조 재가입 및 부정 이용 방지',
    lines: ordered([
      '단순 탈퇴 회원의 재가입을 일률적으로 제한하지 않습니다.',
      '사기, 결제도용, 반복적인 거래 취소 등 중대한 위반으로 이용이 제한된 회원은 제재 기간 동안 재가입할 수 없습니다.',
      '재가입 차단에 필요한 정보는 원문이 아닌 암호화 또는 일방향 변환된 식별값으로 최소한만 보관합니다.',
      '제재 정보의 보관기간과 법적 근거는 개인정보 처리방침에 별도로 명시해야 합니다.',
    ]),
  },
];

const renderLine = ({ marker, text, link, after }: Line, key: number) => {
  const body = (
    <Text style={styles.lineText}>
      {text}
      {link && (
        <Text style={styles.link} onPress={() => Linking.openURL(link.url)}>
          {link.text}
        </Text>
      )}
      {after}
    </Text>
  );
  if (!marker) {
    return <View key={key}>{body}</View>;
  }
  return (
    <View key={key} style={styles.lineRow}>
      <Text style={[styles.lineMarker, styles.markerNumber]}>{marker}</Text>
      {body}
    </View>
  );
};

const WithdrawalPolicyScreen = ({ navigation }: Props) => (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <ScreenHeader title="탈퇴 시 개인정보 및 서비스 이용기록 처리 정책" onBack={() => navigation.goBack()} />

    <ScrollView
      style={styles.scrollContent}
      contentContainerStyle={styles.scrollContentInner}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>탈퇴 시 개인정보 및 서비스 이용기록 처리 정책</Text>
        <Text style={styles.registeredDate}>2026.08.12 10:41</Text>
      </View>

      {SECTIONS.map(section => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionBody}>
            {section.table && <PolicyTable rows={section.table} columnFlex={[2, 1]} />}
            {section.lines?.map(renderLine)}
          </View>
        </View>
      ))}
    </ScrollView>
  </SafeAreaView>
);

export default WithdrawalPolicyScreen;
