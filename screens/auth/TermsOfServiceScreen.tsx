/**
 * 화면: 서비스 이용약관 (TermsOfServiceScreen)
 * 역할: 로그인 화면에서 진입하여 서비스 이용약관 전문을 보여주는 화면입니다.
 */
import React from 'react';
import { Text, View, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './TermsOfServiceScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'TermsOfService'>;

type Span = { text: string; error?: boolean; link?: string };

type Block =
  | { type: 'paragraph'; text?: string; spans?: Span[] }
  | { type: 'ordered'; items: string[] }
  | { type: 'bullet'; items: string[] }
  | { type: 'note'; text?: string; spans?: Span[] };

type Section = { title: string; blocks: Block[] };

const SECTIONS: Section[] = [
  {
    title: '제1조 목적',
    blocks: [
      {
        type: 'paragraph',
        spans: [
          { text: '본 약관은 ' },
          { text: '[회사명]', error: true },
          {
            text:
              '이 운영하는 키치캐치 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 정하는 것을 목적으로 합니다.',
          },
        ],
      },
    ],
  },
  {
    title: '제2조 정의',
    blocks: [
      {
        type: 'ordered',
        items: [
          "'서비스'란 회사가 제공하는 정식 굿즈 탐색, 개인 간 중고거래 중개, 채팅, 안심결제, 위치 기반 매장정보 및 이에 부수하는 서비스를 말합니다.",
          "'회원'이란 본 약관에 동의하고 서비스에 가입한 이용자를 말합니다.",
          "'판매자'란 상품을 등록하고 판매하는 회원을 말합니다.",
          "'구매자'란 판매자가 등록한 상품을 구매하는 회원을 말합니다.",
          "'상품'이란 서비스를 통해 거래되는 정식 굿즈를 말합니다.",
          "'정식 굿즈'란 저작권자, 상표권자 또는 그로부터 적법하게 권한을 받은 사업자가 제작·유통한 상품을 말합니다.",
          "'안심결제'란 결제대행사가 구매자의 결제대금을 구매 확정 전까지 보관하고, 구매 확정 후 판매자에게 지급하는 거래 보호 서비스를 말합니다.",
          "'운영정책'이란 판매금지상품, 제재, 지식재산권, 신고·차단 등 서비스 운영에 관한 세부 정책을 말합니다.",
        ],
      },
    ],
  },
  {
    title: '제3조 약관의 효력과 변경',
    blocks: [
      {
        type: 'ordered',
        items: [
          '본 약관은 서비스 화면에 게시하거나 회원에게 안내한 날부터 효력이 발생합니다.',
          '회사는 관계 법령을 위반하지 않는 범위에서 약관을 변경할 수 있습니다.',
          '일반적인 변경은 적용일 7일 전부터 공지합니다.',
          '회원에게 불리하거나 중요한 변경은 적용일 30일 전부터 공지하고 이메일, 앱 알림 등으로 개별 통지합니다.',
          '회원이 변경 약관에 동의하지 않으면 서비스 이용계약을 해지할 수 있습니다.',
        ],
      },
    ],
  },
  {
    title: '제4조 회원가입',
    blocks: [
      {
        type: 'ordered',
        items: [
          '서비스는 만 14세 이상인 사람만 가입할 수 있습니다.',
          '미성년자는 유료 거래에 법정대리인의 동의가 필요한 경우 해당 동의를 받아야 합니다.',
          '회원은 정확한 정보를 제공해야 하며 타인의 정보를 사용할 수 없습니다.',
          '회사는 허위정보, 명의도용, 이용정지 회피 또는 부정 가입이 확인되면 가입을 거절하거나 계정을 제한할 수 있습니다.',
        ],
      },
    ],
  },
  {
    title: '제5조 계정관리',
    blocks: [
      {
        type: 'ordered',
        items: [
          '회원은 자신의 계정과 인증수단을 안전하게 관리해야 합니다.',
          '계정 대여, 양도 및 판매는 금지됩니다.',
          '계정 도용이 의심되면 즉시 회사에 알려야 합니다.',
          '회원의 고의나 중대한 과실로 발생한 계정 오용에 대해서는 회원이 책임질 수 있습니다.',
        ],
      },
    ],
  },
  {
    title: '제6조 서비스 내용',
    blocks: [
      { type: 'paragraph', text: '회사는 다음 서비스를 제공합니다.' },
      {
        type: 'bullet',
        items: [
          '정식 굿즈 검색 및 정보 제공.',
          '회원 간 상품거래 중개.',
          '판매자와 구매자 간 채팅.',
          '안심결제 및 거래상태 관리.',
          '배송조회, 구매 확정, 환불 및 분쟁 지원.',
          '현재 위치를 이용한 주변 오프라인 매장 탐색.',
          '상품 및 사용자 신고·차단.',
          '그 밖에 회사가 정하는 부가서비스.',
        ],
      },
    ],
  },
  {
    title: '제7조 통신판매중개자의 지위',
    blocks: [
      {
        type: 'ordered',
        items: [
          '회사는 회원 간 거래를 중개하는 통신판매중개자이며 원칙적으로 상품의 판매 당사자가 아닙니다.',
          '상품의 소유권, 진위, 상태, 품질, 적법성, 설명 및 배송에 대한 일차적인 책임은 판매자에게 있습니다.',
          '회사는 안전한 거래를 위해 상품 삭제, 거래 제한, 정산 보류, 환불 중재 및 자료 제출 요구 등의 조치를 할 수 있습니다.',
          '회사가 직접 판매하는 상품에는 별도의 판매조건을 적용합니다.',
        ],
      },
      {
        type: 'note',
        spans: [
          {
            text:
              '통신판매중개자는 자신이 거래 당사자가 아니라는 사실을 결제 등 중요한 거래 단계에서 이용자가 쉽게 알 수 있도록 고지해야 합니다. ',
          },
          {
            text: '전자상거래법 제20조',
            link: 'https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029561431',
          },
        ],
      },
    ],
  },
  {
    title: '제8조 거래의 성립',
    blocks: [
      {
        type: 'ordered',
        items: [
          '구매자가 상품 상세 화면에서 결제를 완료하고 회사가 결제 완료 사실을 안내하면 거래가 성립합니다.',
          '채팅 내용만으로 거래가 성립하지 않습니다.',
          '키치캐치 밖에서 이루어진 송금이나 거래는 서비스 거래로 인정하지 않으며 안심결제 보호를 받을 수 없습니다.',
          '직거래는 지원하지 않으며 택배거래만 허용합니다.',
        ],
      },
    ],
  },
  {
    title: '제9조 판매자의 의무',
    blocks: [
      { type: 'paragraph', text: '판매자는 다음 사항을 준수해야 합니다.' },
      {
        type: 'bullet',
        items: [
          '본인이 소유하거나 처분 권한을 가진 상품만 등록해야 합니다.',
          '정식 굿즈만 판매해야 합니다.',
          '상품 사진, 상태, 하자, 구성품, 정품 여부를 정확하게 표시해야 합니다.',
          '타인의 사진과 설명을 허락 없이 사용해서는 안 됩니다.',
          '결제 완료일부터 3영업일 이내에 상품을 발송해야 합니다.',
          '유효한 택배사와 운송장 정보를 등록해야 합니다.',
          '위조품, 비공식 굿즈 또는 판매금지상품을 판매해서는 안 됩니다.',
          '외부 송금이나 키치캐치 밖의 거래를 유도해서는 안 됩니다.',
        ],
      },
    ],
  },
  {
    title: '제10조 구매자의 의무',
    blocks: [
      { type: 'paragraph', text: '구매자는 다음 사항을 준수해야 합니다.' },
      {
        type: 'bullet',
        items: [
          '결제 전 상품 설명과 상태를 확인해야 합니다.',
          '정확한 배송지와 연락처를 제공해야 합니다.',
          '상품 수령 후 상태를 확인하고 구매 확정 또는 문제 신고를 해야 합니다.',
          '정당한 사유 없이 결제, 취소, 반품을 반복해서는 안 됩니다.',
          '판매자를 협박하거나 부당한 환불 또는 금전을 요구해서는 안 됩니다.',
        ],
      },
    ],
  },
  {
    title: '제11조 안심결제',
    blocks: [
      {
        type: 'ordered',
        items: [
          '서비스 내 모든 거래에는 안심결제가 적용됩니다.',
          '지원 결제수단은 신용·체크카드, 계좌이체 및 가상계좌·무통장입금입니다.',
          '간편결제와 휴대폰 결제는 결제대행사가 C2C 대금보관과 판매자 지급대행을 지원하는 경우 추가할 수 있습니다.',
          '안심결제 이용료는 상품금액과 배송비 합계의 5.5%이며 최소 800원입니다.',
          '이용료는 구매자가 부담하고 부가세가 포함됩니다.',
          '결제대금은 구매 확정 후 판매자에게 정산됩니다.',
        ],
      },
    ],
  },
  {
    title: '제12조 취소·반품·환불',
    blocks: [
      {
        type: 'ordered',
        items: [
          '택배사 집하 전에는 구매자가 주문을 취소할 수 있습니다.',
          '집하 이후에는 반품 절차를 적용합니다.',
          '단순 변심 반품 비용은 구매자가 부담합니다.',
          '상품 하자, 위조품, 오배송, 설명 불일치에 따른 비용은 판매자가 부담합니다.',
          '분쟁이 접수되면 구매 확정과 판매자 정산을 중지합니다.',
          '구체적인 기준은 안심결제 약관 및 환불정책을 따릅니다.',
        ],
      },
    ],
  },
  {
    title: '제13조 금지행위',
    blocks: [
      { type: 'paragraph', text: '회원은 다음 행위를 해서는 안 됩니다.' },
      {
        type: 'bullet',
        items: [
          '위조품, 비공식 굿즈, 2차 창작물 또는 AI 생성 굿즈 판매.',
          '불법·위험·유해 상품 판매.',
          '허위 또는 과장된 상품정보 등록.',
          '결제도용, 사기, 자금세탁 또는 현금화.',
          '외부 거래 및 직접 송금 유도.',
          '욕설, 위협, 성희롱, 스토킹 또는 혐오 표현.',
          '개인정보 공개 또는 거래 목적 외 사용.',
          '신고·후기·결제 기능의 악용.',
          '서비스 운영을 방해하는 자동화 프로그램 사용.',
          '제재를 회피하기 위한 다중 계정 사용.',
        ],
      },
    ],
  },
  {
    title: '제14조 신고 및 차단',
    blocks: [
      {
        type: 'ordered',
        items: [
          '회원은 상품 또는 사용자를 신고할 수 있습니다.',
          '신고는 해당 콘텐츠의 위반 여부를 검토하기 위한 자료로 사용됩니다.',
          '신고만으로 즉시 제재가 확정되는 것은 아닙니다.',
          '회원은 다른 사용자를 차단할 수 있습니다.',
          '차단해도 진행 중인 거래와 필수 거래 알림은 유지됩니다.',
          '허위 또는 보복성 신고를 반복하면 이용이 제한될 수 있습니다.',
        ],
      },
    ],
  },
  {
    title: '제15조 이용제한',
    blocks: [
      {
        type: 'ordered',
        items: [
          '회사는 약관이나 운영정책을 위반한 회원에게 경고, 콘텐츠 삭제, 기능 제한, 일시정지 또는 영구정지 조치를 할 수 있습니다.',
          '사기, 명의도용, 결제도용, 위조품 판매 및 중대한 불법행위는 사전 경고 없이 영구정지할 수 있습니다.',
          '회사는 이용제한 사유와 기간, 이의신청 방법을 회원에게 안내합니다.',
          '회원은 통지를 받은 날부터 14일 이내에 이의를 신청할 수 있습니다.',
        ],
      },
    ],
  },
  {
    title: '제16조 회원 게시물',
    blocks: [
      {
        type: 'ordered',
        items: [
          '게시물의 권리는 작성자 또는 정당한 권리자에게 있습니다.',
          '회원은 서비스 운영, 검색, 노출 및 홍보에 필요한 범위에서 회사가 게시물을 이용하는 것을 허락합니다.',
          '회사는 탈퇴 후 해당 게시물을 작성자 식별정보와 분리하거나 운영상 필요한 범위에서 보존할 수 있습니다.',
          '권리침해 또는 정책 위반 게시물은 사전 통지 없이 임시조치하거나 삭제할 수 있습니다.',
        ],
      },
    ],
  },
  {
    title: '제17조 서비스 변경 및 중단',
    blocks: [
      {
        type: 'paragraph',
        text:
          '회사는 점검, 장애, 보안사고, 법령 또는 사업상 필요에 따라 서비스를 변경하거나 중단할 수 있습니다. 예정된 중단은 사전에 알리고 긴급한 경우 사후에 안내할 수 있습니다.',
      },
    ],
  },
  {
    title: '제18조 책임 제한',
    blocks: [
      {
        type: 'ordered',
        items: [
          '회사는 고의 또는 과실로 회원에게 손해를 발생시킨 경우 관계 법령에 따라 책임을 부담합니다.',
          '회사는 판매자가 제공한 상품정보의 진실성을 보증하지 않지만, 신고나 분쟁이 접수된 경우 필요한 조치를 시행합니다.',
          '회원 간 분쟁은 당사자 간 해결을 원칙으로 하되 회사는 운영정책에 따라 중재할 수 있습니다.',
          '회사는 천재지변, 통신장애 등 합리적으로 통제할 수 없는 사유로 발생한 손해에 대해 책임을 부담하지 않을 수 있습니다.',
        ],
      },
    ],
  },
  {
    title: '제19조 분쟁 해결',
    blocks: [
      {
        type: 'paragraph',
        text:
          '회원은 고객센터를 통해 분쟁 해결을 요청할 수 있습니다. 해결되지 않은 분쟁은 개인정보분쟁조정위원회, 한국소비자원 또는 관할 법원을 이용할 수 있습니다.',
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
    case 'note':
      return (
        <Text key={key} style={styles.note}>
          {block.spans ? renderSpans(block.spans) : block.text}
        </Text>
      );
    case 'ordered':
      return (
        <View key={key}>
          {block.items.map((item, index) => (
            <View key={index} style={styles.listRow}>
              <Text style={[styles.listMarker, styles.listMarkerNumber]}>{`${index + 1}.`}</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      );
    case 'bullet':
      return (
        <View key={key}>
          {block.items.map((item, index) => (
            <View key={index} style={styles.listRow}>
              <Text style={[styles.listMarker, styles.listMarkerBullet]}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      );
    default:
      return null;
  }
};

const TermsOfServiceScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="서비스 이용약관" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentInner}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>키치캐치 서비스 이용약관</Text>
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

export default TermsOfServiceScreen;
