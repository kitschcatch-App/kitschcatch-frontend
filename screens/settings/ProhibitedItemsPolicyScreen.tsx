/**
 * 화면: 판매금지상품 정책 (ProhibitedItemsPolicyScreen)
 * 역할: 약관 및 정책 목록에서 진입하여 판매금지상품 정책 전문을 보여주는 화면입니다.
 * 스타일은 SafePaymentTermsScreen과 공유합니다.
 */
import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from '../payment/SafePaymentTermsScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'ProhibitedItemsPolicy'>;

// marker가 없으면 일반 문단, '•'이면 불릿 줄
type Line = { marker?: string; text: string };
type Section = { title: string; lines: Line[] };

const bullet = (items: string[]): Line[] => items.map(text => ({ marker: '•', text }));

const SECTIONS: Section[] = [
  {
    title: '4-1. 비공식 굿즈',
    lines: [
      { text: '다음 상품은 판매할 수 없습니다.' },
      ...bullet([
        '위조품, 모조품, 복제품 및 레플리카.',
        '권리자의 허락 없이 제작한 2차 창작물.',
        '팬아트, 팬메이드 굿즈 및 비공식 포토카드.',
        'AI로 생성한 이미지나 디자인을 사용한 굿즈.',
        '공식 로고, 캐릭터, 인물 사진 등을 무단으로 사용한 주문제작 상품.',
        '정식 굿즈로 오인하도록 제작하거나 표시한 상품.',
        '공식 상품을 복제·스캔·출력해 제작한 상품.',
      ]),
      {
        text:
          '정식 굿즈에 개인이 만든 포장이나 장식을 추가한 경우에도 상품의 출처나 정품 상태를 오인하게 하면 판매할 수 없습니다.',
      },
    ],
  },
  {
    title: '4-2. 불법·규제 상품',
    lines: bullet([
      '마약류, 불법 의약품 및 처방전.',
      '담배, 전자담배, 주류.',
      '총포, 도검, 폭발물 및 위험한 무기.',
      '도난품, 분실물 및 소유권이 확인되지 않는 상품.',
      '개인정보, 신분증, 통장, 계정 및 인증수단.',
      '불법 촬영물, 성착취물 및 음란물.',
      '관계 법령상 온라인 판매가 금지되거나 신고·허가가 필요한 상품.',
    ]),
  },
  {
    title: '4-3. 무형·금융 상품',
    lines: bullet([
      '게임·SNS·스트리밍 계정.',
      '포인트, 마일리지 및 가상자산.',
      '현금, 상품권, 환금성 쿠폰.',
      '공연·스포츠 티켓 및 본인확인이 필요한 입장권.',
      '다운로드 파일, 이미지, 음원 등 디지털 상품.',
      '투자, 대출, 보험 및 금융상품.',
    ]),
  },
  {
    title: '4-4. 위해·위생 상품',
    lines: bullet([
      '개봉·사용한 식품 및 건강기능식품.',
      '안전성이 확인되지 않은 화장품과 생활화학제품.',
      '리콜 또는 판매중지 대상 상품.',
      '인체에 위해를 줄 수 있는 오염·파손 상품.',
      '살아 있는 동식물과 법령상 거래가 제한된 생물.',
    ]),
  },
  {
    title: '4-5. 거래질서 위반 상품',
    lines: bullet([
      '존재하지 않는 상품.',
      '랜덤박스 등 실제 구성과 가치를 알 수 없는 상품.',
      '구매대행비, 예약금 또는 대여 상품.',
      '하나의 상품을 중복 등록한 게시물.',
      '검색 노출을 위한 무관한 키워드가 포함된 게시물.',
      '외부 결제나 개인계좌 송금을 조건으로 하는 상품.',
    ]),
  },
  {
    title: '4-6. 판매자의 입증책임',
    lines: [
      {
        text:
          '회사는 정식 굿즈 여부를 확인하기 위해 영수증, 구매내역, 정품 인증정보, 패키지 사진 또는 라이선스 자료를 요청할 수 있습니다. 판매자가 합리적인 기간 내에 자료를 제출하지 못하면 상품을 삭제하거나 거래를 취소할 수 있습니다.',
      },
    ],
  },
];

const renderLine = ({ marker, text }: Line, key: number) => {
  if (!marker) {
    return (
      <View key={key}>
        <Text style={styles.lineText}>{text}</Text>
      </View>
    );
  }
  return (
    <View key={key} style={styles.lineRow}>
      <Text style={[styles.lineMarker, styles.markerBullet]}>{marker}</Text>
      <Text style={styles.lineText}>{text}</Text>
    </View>
  );
};

const ProhibitedItemsPolicyScreen = ({ navigation }: Props) => (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <ScreenHeader title="판매금지상품 정책" onBack={() => navigation.goBack()} />

    <ScrollView
      style={styles.scrollContent}
      contentContainerStyle={styles.scrollContentInner}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>판매금지상품 정책</Text>
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

export default ProhibitedItemsPolicyScreen;
