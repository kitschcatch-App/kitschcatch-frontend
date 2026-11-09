/**
 * 화면: 개인정보 수집 및 이용 동의 (PrivacyConsentScreen)
 * 역할: 약관 동의 화면에서 진입하여 개인정보 수집·이용 동의 전문을 보여주는 화면입니다.
 * 스타일은 PrivacyPolicyScreen과 공유합니다.
 */
import React from 'react';
import { Text, View, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './PrivacyPolicyScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'PrivacyConsent'>;

type Block =
  | { type: 'paragraph'; text: string; link?: string; url?: string }
  | { type: 'bullet'; items: string[] }
  | { type: 'table'; rows: string[][] };

type Section = { title: string; blocks: Block[] };

const TABLE_HEADER = ['수집 항목', '이용 목적', '보유기간'];

const SECTIONS: Section[] = [
  {
    title: '필수 수집·이용 동의',
    blocks: [
      {
        type: 'paragraph',
        text: '현재 구현상 카카오 식별자, 이메일, 닉네임을 처리하고 있으며 거래 기능 고도화 시 배송·정산 정보가 추가됩니다.',
      },
      {
        type: 'table',
        rows: [
          TABLE_HEADER,
          ['카카오 회원 식별자, 인증 제공자', '회원 식별, 로그인, 계정관리', '탈퇴 시까지'],
          ['이메일, 닉네임', '회원관리, 서비스 표시, 공지 및 문의 대응', '탈퇴 시까지'],
          ['수령인, 휴대전화번호, 배송지', '상품 배송, 주문 및 분쟁 처리', '거래 종료 후 5년'],
          [
            '주문번호, 상품, 금액, 결제수단, 결제 키, 승인·취소 기록',
            '결제, 환불, 안심결제, 거래 증빙',
            '5년',
          ],
          ['택배사, 운송장, 배송상태', '배송조회, 구매 확정, 분쟁 처리', '5년'],
          ['예금주, 은행, 계좌번호, 본인확인 결과', '판매자 확인 및 정산', '거래 종료 후 5년'],
          ['신고 내용, 문의 내용, 제출 증빙', '신고·분쟁·고객상담 처리', '처리 완료 후 3년'],
          [
            '접속 IP, 기기정보, 서비스 이용기록, 오류기록',
            '보안, 부정이용 방지, 장애 대응',
            '3개월',
          ],
          ['푸시 토큰, 알림 설정', '거래 및 서비스 알림 발송', '탈퇴 또는 토큰 만료 시까지'],
        ],
      },
      {
        type: 'paragraph',
        text: '회원은 개인정보 수집·이용에 동의하지 않을 권리가 있습니다. 다만 필수정보 수집에 동의하지 않으면 회원가입, 상품거래, 배송 또는 정산 기능을 이용할 수 없습니다.',
      },
      {
        type: 'paragraph',
        text: '개인정보 수집 동의에는 수집항목, 목적, 보유기간 및 거부권을 명확하게 표시해야 합니다. ',
        link: '개인정보 보호법 제15조',
        url: 'https://law.go.kr/lsLinkCommonInfo.do?ancYnChk=&chrClsCd=010202&lsJoLnkSeq=1029331575',
      },
    ],
  },
  {
    title: '선택 수집·이용 동의',
    blocks: [
      {
        type: 'table',
        rows: [
          TABLE_HEADER,
          ['현재 위치 또는 근사 위치', '주변 오프라인 매장 검색 및 거리 계산', '검색 완료 후 즉시 파기'],
          ['마케팅 수신 동의 및 연락처', '이벤트, 혜택 및 상품 추천 안내', '동의 철회 또는 탈퇴 시까지'],
        ],
      },
      {
        type: 'paragraph',
        text: '선택항목에 동의하지 않아도 회원가입과 기본 거래기능을 이용할 수 있습니다.',
      },
    ],
  },
  {
    title: '별도로 필요한 제3자 제공 동의',
    blocks: [],
  },
  {
    title: '판매자 제공',
    blocks: [
      {
        type: 'bullet',
        items: [
          '제공받는 자는 해당 거래의 판매자입니다.',
          '제공 항목은 수령인, 휴대전화번호, 배송지 및 배송 요청사항입니다.',
          '제공 목적은 상품 배송과 거래 이행입니다.',
          '보유기간은 배송 및 거래 목적 달성 시까지입니다.',
        ],
      },
    ],
  },
  {
    title: '결제대행사 제공',
    blocks: [
      {
        type: 'bullet',
        items: [
          '제공받는 자는 [토스페이먼츠 등 계약 PG사]입니다.',
          '제공 항목은 주문번호, 결제금액, 구매자 식별정보 및 결제·환불에 필요한 정보입니다.',
          '제공 목적은 결제, 에스크로, 환불 및 판매대금 지급대행입니다.',
          '보유기간은 관계 법령 및 결제대행사 약관에서 정한 기간입니다.',
        ],
      },
      {
        type: 'paragraph',
        text: '카드번호, 카드 비밀번호, 계좌 비밀번호 등 결제 인증정보는 키치캐치 서버에 저장하지 않는 구조로 운영해야 합니다.',
      },
    ],
  },
];

const renderBlock = (block: Block, key: number) => {
  switch (block.type) {
    case 'paragraph':
      return (
        <Text key={key} style={styles.paragraph}>
          {block.text}
          {block.link && (
            <Text style={styles.link} onPress={() => block.url && Linking.openURL(block.url)}>
              {block.link}
            </Text>
          )}
        </Text>
      );
    case 'bullet':
      return (
        <View key={key}>
          {block.items.map((item, index) => (
            <View key={index} style={styles.listRow}>
              <Text style={styles.listMarkerBullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      );
    case 'table':
      return (
        <ScrollView
          key={key}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tableScroll}
        >
          <View style={styles.table}>
            {block.rows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.tableRow}>
                {row.map((cell, cellIndex) => (
                  <View
                    key={cellIndex}
                    style={[styles.tableCell, rowIndex === 0 && styles.tableHeaderCell]}
                  >
                    <Text style={rowIndex === 0 ? styles.tableHeaderText : styles.tableCellText}>
                      {cell}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      );
  }
};

const PrivacyConsentScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="개인정보 수집 및 이용 동의" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentInner}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>개인정보 수집 및 이용 동의</Text>
        <Text style={styles.registeredDate}>2026.08.12 10:41</Text>

        {SECTIONS.map((section, sectionIndex) => (
          <View key={sectionIndex}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.blocks.map((block, blockIndex) => renderBlock(block, blockIndex))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyConsentScreen;
