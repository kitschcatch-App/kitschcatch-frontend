/**
 * 화면: 운영정책 및 제재 기준 (OperationPolicyScreen)
 * 역할: 약관 및 정책 목록에서 진입하여 운영정책 및 제재 기준 전문을 보여주는 화면입니다.
 * 스타일은 SafePaymentTermsScreen과 공유합니다.
 */
import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from '../payment/SafePaymentTermsScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';
import PolicyTable from '../../components/PolicyTable';

type Props = NativeStackScreenProps<RootStackParamList, 'OperationPolicy'>;

// marker가 없으면 일반 문단, '•'은 불릿, '1.' 등은 번호 줄
type Line = { marker?: string; text: string };
// table의 첫 행은 머리글
type Section = { title: string; lines?: Line[]; table?: string[][] };

const ordered = (items: string[]): Line[] =>
  items.map((text, i) => ({ marker: `${i + 1}.`, text }));
const bullet = (items: string[]): Line[] => items.map(text => ({ marker: '•', text }));

// 열 너비 비율: 위반행위 / 1차 / 2차 / 3차 이상
const COLUMN_FLEX = [1.5, 1.3, 1, 1.1];

const SECTIONS: Section[] = [
  {
    title: '5-1. 제재 종류',
    lines: bullet([
      '안내 또는 시정 요청.',
      '경고.',
      '게시물 비공개 또는 삭제.',
      '채팅·판매·구매·신고 기능 제한.',
      '정산 보류.',
      '3일, 7일 또는 30일 이용정지.',
      '영구 이용정지.',
      '관계기관 신고 또는 수사 협조.',
    ]),
  },
  {
    title: '5-2. 제재 기준',
    table: [
      ['위반행위', '1차', '2차', '3차 이상'],
      ['카테고리 오류, 설명 누락', '수정 요청 또는 삭제', '판매 3일 제한', '판매 7일 제한'],
      ['중복 게시물, 키워드 도배', '삭제 및 경고', '판매 3일 제한', '7~30일 제한'],
      ['욕설, 비방, 반복 연락', '경고 또는 채팅 3일 제한', '7일 제한', '30일 또는 영구정지'],
      ['외부 거래·직접 송금 유도', '삭제 및 7일 제한', '30일 제한', '영구정지'],
      ['정당한 사유 없는 미발송·취소 반복', '경고', '판매 7일 제한', '30일 또는 영구정지'],
      ['허위 운송장 등록', '7일 제한', '30일 제한', '영구정지'],
      ['비공식·2차 창작·AI 굿즈 판매', '삭제 및 판매 7일 제한', '30일 제한', '영구정지'],
      ['위조품을 정품으로 표시', '거래 취소 및 영구정지 가능', '영구정지', '영구정지'],
      ['허위·보복성 신고 반복', '경고', '신고 7일 제한', '30일 제한'],
      ['사기, 명의도용, 결제도용', '즉시 영구정지', '해당 없음', '해당 없음'],
      ['불법 촬영물, 마약, 무기 등 중대한 불법상품', '즉시 영구정지 및 관계기관 신고', '해당 없음', '해당 없음'],
      ['개인정보 유포, 협박, 스토킹', '30일 또는 영구정지', '영구정지', '영구정지'],
      ['제재 회피용 계정 생성', '기존 제재 연장 또는 영구정지', '영구정지', '영구정지'],
    ],
  },
  {
    title: '5-3. 가중 및 감경',
    lines: ordered([
      '고의성, 피해규모, 반복성, 자진 시정 및 조사 협조 여부를 고려합니다.',
      '중대한 위반은 횟수와 관계없이 즉시 영구정지할 수 있습니다.',
      '최근 12개월 내 동일하거나 유사한 위반은 반복 위반으로 봅니다.',
      '여러 위반이 동시에 발생하면 가장 무거운 제재를 기준으로 가중할 수 있습니다.',
    ]),
  },
  {
    title: '5-4. 정산 보류',
    lines: [
      {
        text:
          '사기, 위조품, 결제도용 또는 분쟁이 의심되는 경우 관련 거래금액 범위에서 정산을 보류할 수 있습니다. 회사는 보류 사유와 해제 조건을 판매자에게 안내해야 합니다.',
      },
    ],
  },
  {
    title: '5-5. 이의신청',
    lines: [
      {
        text:
          '회원은 제재 통지일로부터 14일 이내에 이의를 신청할 수 있습니다. 회사는 접수 후 원칙적으로 10영업일 이내에 결과 또는 처리 일정을 안내합니다.',
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
      <Text style={[styles.lineMarker, marker === '•' ? styles.markerBullet : styles.markerNumber]}>
        {marker}
      </Text>
      <Text style={styles.lineText}>{text}</Text>
    </View>
  );
};

const OperationPolicyScreen = ({ navigation }: Props) => (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <ScreenHeader title="운영정책 및 제재 기준" onBack={() => navigation.goBack()} />

    <ScrollView
      style={styles.scrollContent}
      contentContainerStyle={styles.scrollContentInner}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>운영정책 및 제재 기준</Text>
        <Text style={styles.registeredDate}>2026.08.12 10:41</Text>
      </View>

      {SECTIONS.map(section => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionBody}>
            {section.lines?.map(renderLine)}
            {section.table && <PolicyTable rows={section.table} columnFlex={COLUMN_FLEX} />}
          </View>
        </View>
      ))}
    </ScrollView>
  </SafeAreaView>
);

export default OperationPolicyScreen;
