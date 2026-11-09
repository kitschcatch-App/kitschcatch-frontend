/**
 * 화면: 지식재산권 및 정식 굿즈 정책 (IpPolicyScreen)
 * 역할: 약관 및 정책 목록에서 진입하여 지식재산권 및 정식 굿즈 정책 전문을 보여주는 화면입니다.
 * 스타일은 SafePaymentTermsScreen과 공유합니다.
 */
import React from 'react';
import { Text, View, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from '../payment/SafePaymentTermsScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'IpPolicy'>;

// marker가 없으면 일반 문단, '•'이면 불릿 줄, link는 문장 끝에 붙는 밑줄 링크
type Line = { marker?: string; text: string; link?: { text: string; url: string } };
type Section = { title: string; lines: Line[] };

const bullet = (items: string[]): Line[] => items.map(text => ({ marker: '•', text }));

const COPYRIGHT_LAW_URL =
  'https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsId=000798&lsJoLnkSeq=900605727&print=print';

const SECTIONS: Section[] = [
  {
    title: '제1조 기본원칙',
    lines: [
      {
        text:
          '키치캐치는 정식 굿즈만 거래할 수 있는 서비스입니다. 법적으로 판매 가능한 2차 창작물이라도 키치캐치의 서비스 운영방침에 따라 판매를 허용하지 않습니다.',
      },
    ],
  },
  {
    title: '제2조 판매 가능한 상품',
    lines: [
      { text: '다음 조건을 충족한 상품만 판매할 수 있습니다.' },
      ...bullet([
        '저작권자 또는 상표권자가 직접 제작·판매한 상품.',
        '권리자로부터 정식 라이선스를 받은 제조·유통사가 제작한 상품.',
        '공식 행사, 공식 매장 또는 공인 유통처에서 판매한 상품.',
        '정식 굿즈의 중고상품.',
        '공식 증정품, 특전 및 부록으로 출처를 확인할 수 있는 상품.',
      ]),
    ],
  },
  {
    title: '제3조 판매할 수 없는 상품',
    lines: bullet([
      '팬아트와 팬메이드 굿즈.',
      '비공식 포토카드, 스티커, 포스터 및 인쇄물.',
      '캐릭터나 연예인 이미지를 무단 사용한 상품.',
      '공식 상품을 스캔·복제·재가공한 상품.',
      'AI 생성 이미지 또는 AI 생성 디자인을 사용한 상품.',
      '일부만 AI로 생성하거나 AI 이미지를 수정해 제작한 상품.',
      '패러디, 오마주 또는 개인소장용이라는 이유로 제작한 판매상품.',
      '정식 라이선스를 입증할 수 없는 주문제작 상품.',
      '가품, 레플리카 및 정품과 유사하게 제작한 상품.',
    ]),
  },
  {
    title: '제4조 판매자의 보증',
    lines: [
      { text: '판매자는 상품 등록 시 다음 사항을 보증합니다.' },
      ...bullet([
        '상품을 판매할 권한이 있습니다.',
        '상품과 게시물이 제3자의 저작권, 상표권, 초상권 및 퍼블리시티권을 침해하지 않습니다.',
        '상품을 정식 굿즈로 오인하게 하는 설명을 사용하지 않습니다.',
        '회사 요청 시 정식 유통 또는 구매 사실을 증명할 수 있습니다.',
      ]),
    ],
  },
  {
    title: '제5조 권리침해 신고',
    lines: [
      { text: '권리자는 다음 정보를 제출해 게시물 중단을 요청할 수 있습니다.' },
      ...bullet([
        '권리자의 성명과 연락처.',
        '침해되었다고 주장하는 저작물 또는 권리.',
        '신고 대상 상품번호 또는 URL.',
        '권리 보유를 증명하는 자료.',
        '침해라고 판단하는 구체적인 이유.',
        '제출 내용이 사실이라는 확인과 서명.',
      ]),
      {
        text:
          '회사는 요건을 갖춘 요청을 받으면 게시물을 임시 중단하고 판매자에게 그 사실을 알립니다. 저작권법은 권리자가 침해 사실을 소명해 복제·전송 중단을 요청할 수 있도록 규정합니다. ',
        link: { text: '저작권법 제103조', url: COPYRIGHT_LAW_URL },
      },
    ],
  },
  {
    title: '제6조 판매자의 소명',
    lines: [
      {
        text:
          '판매자는 정당한 권한이 있다는 자료를 제출해 게시물 복원을 요청할 수 있습니다. 회사는 법정 절차와 제출자료를 검토해 복원, 삭제 또는 추가 제한 여부를 결정합니다.',
      },
    ],
  },
  {
    title: '제7조 반복 침해자',
    lines: [
      {
        text:
          '반복적으로 권리침해 상품을 등록하거나 고의로 위조품을 판매한 회원은 판매 제한 또는 영구정지할 수 있습니다.',
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
      <Text style={[styles.lineMarker, styles.markerBullet]}>{marker}</Text>
      {body}
    </View>
  );
};

const IpPolicyScreen = ({ navigation }: Props) => (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <ScreenHeader title="지식재산권 및 정식 굿즈 정책" onBack={() => navigation.goBack()} />

    <ScrollView
      style={styles.scrollContent}
      contentContainerStyle={styles.scrollContentInner}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>지식재산권 및 정식 굿즈 정책</Text>
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

export default IpPolicyScreen;
