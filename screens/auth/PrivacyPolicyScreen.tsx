/**
 * 화면: 개인정보처리방침 (PrivacyPolicyScreen)
 * 역할: 로그인 화면에서 진입하여 개인정보처리방침 전문을 보여주는 화면입니다.
 */
import React from 'react';
import { Text, View, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './PrivacyPolicyScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'PrivacyPolicy'>;

type Span = { text: string; error?: boolean; link?: string };

type Block =
  | { type: 'paragraph'; text?: string; spans?: Span[] }
  | { type: 'bullet'; items: string[] }
  | { type: 'table'; rows: string[][] };

type Section = { title: string; blocks: Block[] };

const SECTIONS: Section[] = [
  {
    title: '5.1. 개인정보 처리 목적·항목·보유기간',
    blocks: [
      {
        type: 'table',
        rows: [
          ['구분', '처리 목적', '처리 항목', '보유기간'],
          [
            '회원가입·로그인',
            '회원 식별, 로그인, 계정 관리',
            '소셜 로그인 제공자 및 이용자 식별값, 이메일, 닉네임',
            '회원 탈퇴 시까지. 법령상 보존 대상은 별도 보관',
          ],
          [
            '상품 등록·채팅',
            '판매 게시글 게시, 이용자 간 의사소통',
            '회원 식별값, 게시글 내용·사진, 채팅 내용·이미지, 작성·전송 시각',
            '[게시글·채팅의 삭제 및 탈퇴 후 처리 기준과 기간]',
          ],
          [
            '주문·결제',
            '주문 처리, 결제 확인, 취소·환불',
            '회원 식별값, 주문번호, 상품·거래 정보, 결제금액·수단·상태, 결제 식별값',
            '거래 종료 후 관계 법령에 따른 기간',
          ],
          [
            '배송 기능 도입 시',
            '상품 배송 및 배송 문의 처리',
            '수령인 이름, 연락처, 배송지, 택배사, 운송장 번호',
            '[배송정보 보유기간 및 법령상 보존 범위]',
          ],
          [
            '정산 기능 도입 시',
            '판매대금 지급 및 정산 문의 처리',
            '은행명, 계좌번호, 예금주, 정산 내역',
            '[정산정보 보유기간 및 법적 근거]',
          ],
          [
            '고객 문의',
            '문의 응대 및 분쟁 처리',
            '[회신 연락처], 문의 내용, 첨부자료, 처리 이력',
            '문의 처리 완료 시까지. 법령상 보존 대상은 해당 기간',
          ],
          [
            '선택적 마케팅',
            '이벤트·프로모션 등 광고성 정보 발송',
            '[실제 이용하는 이메일·휴대전화번호·푸시 토큰], 동의 내역',
            '동의 철회 또는 회원 탈퇴 중 먼저 도래하는 때까지',
          ],
        ],
      },
    ],
  },
  {
    title: '5.2. 법령에 따른 보관',
    blocks: [
      {
        type: 'table',
        rows: [
          ['보존 대상', '보존기간'],
          ['계약 또는 청약철회 등에 관한 기록', '5년'],
          ['대금결제 및 재화 등의 공급에 관한 기록', '5년'],
          ['소비자 불만 또는 분쟁처리에 관한 기록', '3년'],
          ['표시·광고에 관한 기록', '6개월'],
        ],
      },
      {
        type: 'paragraph',
        spans: [
          { text: '근거는 ' },
          {
            text: '전자상거래법 시행령 제6조',
            link: 'https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1018638379',
          },
          { text: '입니다.' },
        ],
      },
    ],
  },
  {
    title: '5.3. 개인정보의 제3자 제공',
    blocks: [
      {
        type: 'paragraph',
        text:
          '회사는 이용자의 동의 또는 법령상 허용되는 근거가 있는 경우에만 개인정보를 제3자에게 제공합니다.',
      },
      {
        type: 'paragraph',
        text:
          '배송을 위해 구매자의 정보를 판매자에게 제공하는 경우, 제공 전에 다음 내용을 구체적으로 안내하고 필요한 동의를 받습니다.',
      },
      {
        type: 'table',
        rows: [
          ['항목', '내용'],
          ['제공받는 자', '해당 거래의 판매자 [식별 가능한 정보]'],
          ['제공 목적', '상품 배송 및 배송 관련 연락'],
          ['제공 항목', '수령인 이름, 연락처, 배송지'],
          ['보유·이용기간', '[배송·반품 처리에 필요한 기간]'],
          ['동의 거부에 따른 영향', '해당 배송 거래 진행이 제한될 수 있습니다.'],
        ],
      },
      {
        type: 'paragraph',
        text:
          '그 밖의 제공 내역은 [제공받는 자·목적·항목·기간·법적 근거]를 기재합니다. 실제 제공이 없다면 해당 내용은 삭제하고 제공하지 않는다고 명시합니다.',
      },
    ],
  },
  {
    title: '5.4. 개인정보 처리업무의 위탁',
    blocks: [
      { type: 'paragraph', text: '회사는 서비스 운영을 위해 다음 업무를 위탁합니다.' },
      {
        type: 'table',
        rows: [
          ['수탁자', '위탁 업무'],
          ['[실제 계약된 결제 처리업체명]', '결제 처리 및 취소·환불'],
          ['[실제 계약된 클라우드 사업자명]', '서버 운영 및 데이터 보관'],
          ['[실제 계약된 알림 발송업체명]', '문자·이메일·푸시 등 발송'],
          ['[기타 수탁자명]', '[위탁 업무]'],
        ],
      },
      {
        type: 'paragraph',
        text:
          '회사는 위탁계약에 개인정보 보호 의무를 정하고 수탁자의 처리 현황을 관리·감독합니다. 위 목록은 실제 계약과 정보 흐름에 맞게 확정합니다.',
      },
    ],
  },
  {
    title: '5.5. 개인정보의 국외 이전',
    blocks: [
      { type: 'paragraph', text: '[국외 이전 여부를 확인해 기재합니다.]' },
      { type: 'paragraph', text: '국외 이전이 있는 경우 다음 항목을 명시합니다.' },
      {
        type: 'bullet',
        items: [
          '이전받는 자와 연락처.',
          '이전 국가.',
          '이전 항목.',
          '이전 시기 및 방법.',
          '이전 목적.',
          '보유기간.',
          '이전의 법적 근거.',
          '거부 방법과 효과.',
        ],
      },
      {
        type: 'paragraph',
        text: '클라우드 저장 위치뿐 아니라 해외 업체의 접근·처리 여부도 반영합니다.',
      },
    ],
  },
  {
    title: '5.6. 개인정보 파기',
    blocks: [
      {
        type: 'paragraph',
        text:
          '회사는 보유기간이 지나거나 처리 목적이 달성돼 개인정보가 불필요해지면 지체 없이 파기합니다. 법령상 보관해야 하는 정보는 별도로 보관한 뒤 해당 기간이 끝나면 파기합니다.',
      },
      {
        type: 'paragraph',
        text: '전자파일은 복구할 수 없는 방법으로 삭제하고, 종이 문서는 분쇄 또는 소각합니다.',
      },
    ],
  },
  {
    title: '5.7. 이용자의 권리와 행사 방법',
    blocks: [
      {
        type: 'paragraph',
        text:
          '이용자는 자신의 개인정보에 대해 열람, 정정·삭제, 처리정지 및 동의 철회를 요청할 수 있습니다. 요청은 [앱 내 신청 경로] 또는 [개인정보 문의 이메일]로 접수할 수 있습니다.',
      },
      {
        type: 'paragraph',
        text:
          '회사는 본인 또는 적법한 대리인 여부를 확인한 뒤 관계 법령에 따라 처리합니다. 법령상 의무로 요청을 제한하는 경우에는 그 사유를 안내합니다.',
      },
    ],
  },
  {
    title: '5.8. 개인정보의 안전성 확보조치',
    blocks: [
      {
        type: 'paragraph',
        text:
          '회사는 개인정보 보호를 위해 [실제 시행 중인 접근권한 관리, 전송구간 암호화, 중요정보 암호화, 접속기록 관리, 보안교육 및 점검 등]의 조치를 시행합니다.',
      },
    ],
  },
  {
    title: '5.9. 자동 수집 장치 및 아동의 개인정보',
    blocks: [
      {
        type: 'table',
        rows: [
          ['구분', '기재 사항'],
          ['쿠키·분석 도구', '[사용 여부, 도구명, 수집 항목·목적·기간, 거부 방법 및 거부 시 영향]'],
          ['만 14세 미만 이용자', '[가입 제한 여부 또는 법정대리인 동의·확인 절차]'],
        ],
      },
    ],
  },
  {
    title: '5.10. 개인정보 보호책임자 및 권리구제',
    blocks: [
      {
        type: 'table',
        rows: [
          ['항목', '내용'],
          ['개인정보 보호책임자', '[성명 또는 담당 부서·직책]'],
          ['이메일', '[개인정보 문의 이메일]'],
          ['전화번호', '[연락처]'],
          ['개인정보 열람청구 담당 부서', '[부서명 및 연락처]'],
        ],
      },
      {
        type: 'paragraph',
        spans: [
          { text: '개인정보 침해 상담·신고는 ' },
          { text: '개인정보침해신고센터', link: 'https://privacy.kisa.or.kr/' },
          { text: ', 분쟁조정 신청은 ' },
          { text: '개인정보분쟁조정위원회', link: 'https://www.kopico.go.kr/' },
          { text: '를 이용할 수 있습니다.' },
        ],
      },
    ],
  },
  {
    title: '5.11. 처리방침 변경',
    blocks: [
      {
        type: 'paragraph',
        spans: [
          { text: '이 처리방침은 ' },
          { text: '[YYYY년 MM월 DD일]', error: true },
          {
            text:
              '부터 시행합니다. 변경 시 변경 내용과 시행일을 [앱 내 공지 경로]에 안내하고 이전 버전도 확인할 수 있도록 제공합니다.',
          },
        ],
      },
    ],
  },
];

const renderSpans = (spans: Span[]) =>
  spans.map((span, index) =>
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
          {block.spans ? renderSpans(block.spans) : block.text}
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
    default:
      return null;
  }
};

const PrivacyPolicyScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="개인정보처리방침 정책" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentInner}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>개인정보처리방침 정책</Text>
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

export default PrivacyPolicyScreen;
