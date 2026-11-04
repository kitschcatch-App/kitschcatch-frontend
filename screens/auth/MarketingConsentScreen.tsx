/**
 * 화면: 마케팅 정보 수신 동의 정책 (MarketingConsentScreen)
 * 역할: 약관 동의 화면에서 진입하여 마케팅 정보 수신 동의 정책 전문을 보여주는 화면입니다.
 * 스타일은 PrivacyPolicyScreen과 공유합니다.
 */
import React from 'react';
import { Text, View, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './PrivacyPolicyScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'MarketingConsent'>;

type Span = { text: string; error?: boolean; link?: string };
type Content = string | Span[];

type Block =
  | { type: 'paragraph'; content: Content }
  | { type: 'bullet'; items: Content[] }
  | { type: 'table'; rows: string[][] };

type Section = { title: string; blocks: Block[] };

const SECTIONS: Section[] = [
  {
    title: '키치캐치 마케팅 목적 개인정보 수집·이용 및 광고성 정보 수신동의',
    blocks: [
      {
        type: 'paragraph',
        content:
          '[운영사명]은 이용자가 동의한 경우에 한해 키치캐치의 이벤트, 할인, 프로모션 등 광고성 정보를 발송합니다.',
      },
    ],
  },
  {
    title: '6.1. 마케팅 목적 개인정보 수집·이용 동의',
    blocks: [
      {
        type: 'table',
        rows: [
          ['항목', '내용'],
          ['수집·이용 목적', '키치캐치 이벤트, 할인, 프로모션 등 광고성 정보 발송'],
          [
            '수집·이용 항목',
            '선택한 수신 채널에 필요한 [이메일 주소, 휴대전화번호, 앱 푸시 토큰 등 실제 항목]',
          ],
          ['보유·이용기간', '동의 철회 또는 회원 탈퇴 중 먼저 도래하는 때까지'],
          [
            '동의 거부 권리',
            '동의를 거부할 수 있으며, 거부해도 회원가입과 거래 등 기본 서비스를 이용할 수 있습니다. 다만 광고성 정보는 제공되지 않습니다.',
          ],
        ],
      },
    ],
  },
  {
    title: '6.2. 광고성 정보 수신동의',
    blocks: [
      {
        type: 'paragraph',
        content:
          '이용자가 선택한 채널로 광고성 정보를 발송합니다. 운영하는 채널만 아래 선택 항목에 표시합니다.',
      },
      {
        type: 'bullet',
        items: [
          '[선택] 마케팅 목적 개인정보 수집·이용에 동의합니다.',
          '[선택] 앱 푸시로 광고성 정보를 받겠습니다.',
          '[선택] 이메일로 광고성 정보를 받겠습니다.',
          '[선택] 문자메시지로 광고성 정보를 받겠습니다.',
        ],
      },
      { type: 'paragraph', content: '운영 기준.' },
      {
        type: 'paragraph',
        content: [
          {
            text: '광고성 정보 수신동의는 개인정보 수집·이용 동의와 구분하고, 선택란은 기본적으로 해제된 상태로 제공합니다. 수신동의 명칭에는 광고성 정보라는 점을 명확히 표시합니다. ',
          },
          { text: 'KISA 광고성 정보 안내.', link: 'https://spam.kisa.or.kr/spam/main.do' },
        ],
      },
    ],
  },
  {
    title: '6.3. 수신 거부 및 동의 철회',
    blocks: [
      {
        type: 'paragraph',
        content:
          '광고성 정보 수신은 언제든지 무료로 철회할 수 있습니다. 앱의 [광고성 정보 수신 설정 경로] 또는 각 광고 메시지에 안내된 무료 수신 거부 방법을 이용해 주세요.',
      },
      {
        type: 'paragraph',
        content:
          '철회한 채널로는 광고성 정보를 발송하지 않습니다. 다만 주문, 결제, 배송, 정산 등 거래 이행에 필요한 비광고성 안내는 별도로 제공될 수 있습니다.',
      },
    ],
  },
  {
    title: '6.4. 발송 기준',
    blocks: [
      {
        type: 'paragraph',
        content:
          '광고성 정보에는 관련 법령과 채널별 기준에 따라 광고 표시, 발신자 정보 및 무료 수신 거부 방법을 안내합니다.',
      },
      {
        type: 'paragraph',
        content:
          '키치캐치는 광고성 정보를 오전 8시부터 오후 9시 전까지 발송합니다. 야간 광고 발송을 운영하는 경우에는 필요한 별도 동의를 받습니다.',
      },
      {
        type: 'paragraph',
        content: [
          { text: '명시적 사전 동의, 철회 후 발송 중단, 무료 수신 거부와 야간 전송 관련 기준은 ' },
          {
            text: '정보통신망법 제50조',
            link: 'https://www.law.go.kr/LSW/lsLinkCommonInfo.do?ancYnChk=&chrClsCd=010202&lsJoLnkSeq=1025057211',
          },
          { text: '를 반영했습니다.' },
        ],
      },
    ],
  },
  {
    title: '6.5. 동의 내역 관리',
    blocks: [
      {
        type: 'paragraph',
        content:
          '회사는 수신동의 및 철회 일시와 선택 채널을 기록하고, 처리 결과 통지와 정기적인 수신동의 여부 확인을 관계 법령에 따라 진행합니다.',
      },
      {
        type: 'paragraph',
        content: '증빙 기록의 별도 보관이 필요한 경우에는 [보관 항목·법적 근거·기간]을 명시합니다.',
      },
    ],
  },
  {
    title: '6.6. 시행일',
    blocks: [
      {
        type: 'paragraph',
        content: [
          { text: '이 정책은 ' },
          { text: '[YYYY년 MM월 DD일]', error: true },
          { text: '부터 시행합니다.' },
        ],
      },
    ],
  },
];

const renderContent = (content: Content) =>
  typeof content === 'string'
    ? content
    : content.map((span, index) =>
        span.link ? (
          <Text
            key={index}
            style={styles.link}
            onPress={() => Linking.openURL(span.link as string)}
          >
            {span.text}
          </Text>
        ) : (
          <Text key={index} style={span.error ? styles.errorText : undefined}>
            {span.text}
          </Text>
        ),
      );

const renderBlock = (block: Block, key: number) => {
  switch (block.type) {
    case 'paragraph':
      return (
        <Text key={key} style={styles.paragraph}>
          {renderContent(block.content)}
        </Text>
      );
    case 'bullet':
      return (
        <View key={key}>
          {block.items.map((item, index) => (
            <View key={index} style={styles.listRow}>
              <Text style={styles.listMarkerBullet}>•</Text>
              <Text style={styles.listText}>{renderContent(item)}</Text>
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

const MarketingConsentScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="마케팅 정보 수신 동의 정책" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentInner}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>마케팅 정보 수신 동의 정책</Text>
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

export default MarketingConsentScreen;
