/**
 * 화면: 위치기반서비스 이용약관 (LocationTermsScreen)
 * 역할: 약관 동의 화면에서 진입하여 위치기반서비스 이용약관 전문을 보여주는 화면입니다.
 * 스타일은 PrivacyPolicyScreen과 공유합니다.
 */
import React from 'react';
import { Text, View, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './PrivacyPolicyScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationTerms'>;

type Span = { text: string; error?: boolean; link?: string };
type Content = string | Span[];

type Block =
  | { type: 'paragraph'; content: Content }
  | { type: 'bullet' | 'numbered'; items: Content[] };

type Section = { title: string; blocks: Block[] };

const err = (text: string): Span[] => [{ text, error: true }];

const SECTIONS: Section[] = [
  {
    title: '제1조 목적',
    blocks: [
      {
        type: 'paragraph',
        content:
          '본 약관은 회사가 제공하는 위치기반서비스와 관련하여 회사와 개인위치정보주체의 권리·의무 및 책임사항을 정하는 것을 목적으로 합니다.',
      },
    ],
  },
  {
    title: '제2조 서비스 내용',
    blocks: [
      {
        type: 'paragraph',
        content: '회사는 회원의 현재 위치를 일시적으로 이용하여 다음 서비스를 제공합니다.',
      },
      {
        type: 'bullet',
        items: [
          '현재 위치 주변 오프라인 굿즈 매장 검색.',
          '현재 위치와 매장 간 거리 계산.',
          '지도상 현재 위치와 매장 표시.',
          '거리순 또는 지역순 검색 결과 제공.',
        ],
      },
    ],
  },
  {
    title: '제3조 이용요금',
    blocks: [
      {
        type: 'paragraph',
        content:
          '위치기반서비스는 무료입니다. 다만 데이터 통신료는 회원이 이용하는 통신사 요금제에 따라 발생할 수 있습니다.',
      },
    ],
  },
  {
    title: '제4조 개인위치정보의 이용',
    blocks: [
      {
        type: 'numbered',
        items: [
          '회사는 위치기반서비스 제공에 필요한 최소 범위에서 현재 위치를 이용합니다.',
          '현재 위치는 주변 매장 검색과 거리 계산 후 즉시 파기하며 지속적인 이동경로를 저장하지 않습니다.',
          '회사는 회원의 별도 동의 없이 개인위치정보를 광고 또는 제3자 제공 목적으로 이용하지 않습니다.',
          '위치 권한을 허용하지 않은 회원은 주소나 지역을 직접 입력해 매장을 검색할 수 있습니다.',
        ],
      },
    ],
  },
  {
    title: '제5조 이용·제공사실 확인자료',
    blocks: [
      {
        type: 'paragraph',
        content:
          '회사는 위치정보법에 따라 위치정보 이용·제공사실 확인자료를 자동으로 기록하고 6개월간 보관합니다. 확인자료에는 실제 좌표가 아닌 이용 일시, 이용 목적 및 처리방법 등이 포함됩니다.',
      },
      {
        type: 'paragraph',
        content: [
          {
            text: '위치정보법은 서비스 내용, 회원 권리, 보유 근거와 기간 등을 이용약관에 명시하고 동의를 받도록 규정합니다. ',
          },
          {
            text: '위치정보법 제19조',
            link: 'https://law.go.kr/LSW/lsInfoP.do?lsiSeq=176715#0000',
          },
        ],
      },
    ],
  },
  {
    title: '제6조 회원의 권리',
    blocks: [
      { type: 'paragraph', content: '회원은 언제든지 다음 권리를 행사할 수 있습니다.' },
      {
        type: 'bullet',
        items: [
          '위치정보 이용 동의의 전부 또는 일부 철회.',
          '위치정보 이용의 일시 중지.',
          '위치정보 이용·제공사실 확인자료 열람.',
          '오류가 있는 정보의 정정 요청.',
          '위치정보가 제3자에게 제공된 경우 그 이유와 내용 확인.',
        ],
      },
    ],
  },
  {
    title: '제7조 만 14세 미만 아동',
    blocks: [{ type: 'paragraph', content: '회사는 만 14세 미만 아동의 개인위치정보를 처리하지 않습니다.' }],
  },
  {
    title: '제8조 보호조치',
    blocks: [
      {
        type: 'paragraph',
        content:
          '회사는 접근권한 제한, 접속기록 보관, 암호화, 보안프로그램 운영 등 개인위치정보 보호에 필요한 조치를 시행합니다.',
      },
    ],
  },
  {
    title: '제9조 책임 및 분쟁',
    blocks: [
      {
        type: 'paragraph',
        content:
          '회사가 고의 또는 과실로 위치정보법을 위반하여 손해를 발생시킨 경우 관계 법령에 따라 책임을 부담합니다. 위치정보 관련 분쟁은 개인정보분쟁조정위원회에 조정을 신청할 수 있습니다.',
      },
    ],
  },
  {
    title: '제10조 위치정보 관리책임자',
    blocks: [
      {
        type: 'bullet',
        items: [
          [{ text: '성명 및 직책은 ' }, ...err('[위치정보 관리책임자]'), { text: '입니다.' }],
          [{ text: '이메일은 ' }, ...err('[이메일]'), { text: '입니다.' }],
          [{ text: '전화번호는 ' }, ...err('[전화번호]'), { text: '입니다.' }],
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
  if (block.type === 'paragraph') {
    return (
      <Text key={key} style={styles.paragraph}>
        {renderContent(block.content)}
      </Text>
    );
  }
  return (
    <View key={key}>
      {block.items.map((item, index) => (
        <View key={index} style={styles.listRow}>
          <Text style={styles.listMarkerBullet}>
            {block.type === 'numbered' ? `${index + 1}.` : '•'}
          </Text>
          <Text style={styles.listText}>{renderContent(item)}</Text>
        </View>
      ))}
    </View>
  );
};

const LocationTermsScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="위치기반서비스 이용약관" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentInner}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>위치기반서비스 이용약관</Text>
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

export default LocationTermsScreen;
