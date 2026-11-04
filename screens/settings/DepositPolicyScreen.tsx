/**
 * 화면: 입금 확인 및 자동 취소 정책 (DepositPolicyScreen)
 * 역할: 약관 및 정책 목록에서 진입하여 입금 확인 및 자동 취소 정책 전문을 보여주는 화면입니다.
 * 스타일은 SafePaymentTermsScreen과 공유합니다.
 */
import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from '../payment/SafePaymentTermsScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'DepositPolicy'>;

type Section = { title: string; lines: string[] };

const SECTIONS: Section[] = [
  {
    title: '제1조 입금 방법',
    lines: [
      '무통장입금은 주문별로 발급된 일회성 가상계좌를 이용하는 것을 원칙으로 합니다.',
      '구매자는 안내된 계좌에 주문금액과 동일한 금액을 입금해야 합니다.',
      '가상계좌가 발급된 주문은 금액이나 상품 구성을 변경할 수 없습니다. 변경이 필요하면 기존 주문을 취소하고 다시 주문해야 합니다.',
      '회사 명의 일반계좌로 직접 송금하는 방식은 입금자 식별 오류가 발생하므로 운영하지 않는 것을 권장합니다.',
    ],
  },
  {
    title: '제2조 입금 확인',
    lines: [
      '입금 확인은 은행과 PG사로부터 정상 입금 결과를 받은 시점을 기준으로 합니다.',
      '정상적인 경우 입금 후 수분 이내에 결제 완료로 변경됩니다.',
      '입금 후 30분이 지나도 반영되지 않으면 주문번호와 입금증을 첨부해 고객센터에 문의할 수 있습니다.',
      '은행 또는 PG사 점검시간에는 입금 확인이 지연될 수 있습니다.',
      '입금자명보다 가상계좌번호, 주문번호, 입금금액 및 PG 거래번호를 우선해 입금을 식별합니다.',
    ],
  },
  {
    title: '제3조 입금기한과 자동 취소',
    lines: [
      '가상계좌 입금기한은 계좌 발급 시점부터 24시간으로 합니다.',
      '입금기한은 주문 상세 화면과 알림으로 안내합니다.',
      '기한 내 입금되지 않으면 주문을 자동 취소하고 판매상품을 다시 판매 가능 상태로 전환합니다.',
      '자동 취소된 주문의 가상계좌는 다시 사용할 수 없습니다.',
      '입금과 자동 취소가 동시에 처리되는 경우 PG사의 입금 승인시각을 기준으로 판단합니다.',
      '기한 내 입금했지만 금융기관 처리 지연으로 주문이 취소된 경우 상품을 임의로 재확보하지 않고 입금액 전액을 환불합니다. 이미 다른 구매자에게 판매될 수 있기 때문입니다.',
      '기한이 지난 뒤 은행 오류 등으로 입금이 접수된 경우에도 주문은 복구하지 않고 3영업일 이내에 전액 환불합니다.',
      '잘못된 금액이나 계좌로 송금한 경우 실제 입금 사실이 확인된 뒤 환불하며, 제3자 계좌로의 환불은 명의 확인이 완료된 경우에만 허용합니다.',
    ],
  },
];

const DepositPolicyScreen = ({ navigation }: Props) => (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <ScreenHeader title="입금 확인 및 자동 취소 정책" onBack={() => navigation.goBack()} />

    <ScrollView
      style={styles.scrollContent}
      contentContainerStyle={styles.scrollContentInner}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>입금 확인 및 자동 취소 정책</Text>
        <Text style={styles.registeredDate}>2026.08.12 10:41</Text>
      </View>

      {SECTIONS.map(section => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionBody}>
            {section.lines.map((text, i) => (
              <View key={i} style={styles.lineRow}>
                <Text style={[styles.lineMarker, styles.markerNumber]}>{i + 1}.</Text>
                <Text style={styles.lineText}>{text}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  </SafeAreaView>
);

export default DepositPolicyScreen;
