/**
 * 화면: 구매내역 주문 상세 화면 (PurchaseOrderDetailScreen)
 * 역할: 구매내역에서 상품을 선택했을 때 주문의 진행 상태를 단계별로 보여주는 화면입니다.
 */
import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './PurchaseOrderDetailScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';
import DropdownIcon from '../../assets/dropdown.svg';
import DropdownReIcon from '../../assets/dropdown-re.svg';
import Process1Icon from '../../assets/process1.svg';
import Process2Icon from '../../assets/process2.svg';
import Process3Icon from '../../assets/process3.svg';
import Process4Icon from '../../assets/process4.svg';
import Process5Icon from '../../assets/process5.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'PurchaseOrderDetail'>;

const PROCESS_STEPS = [
  { label: '결제 완료', subtitle: '결제가 완료되었어요.', Icon: Process1Icon },
  { label: '배송 준비', subtitle: '', Icon: Process2Icon },
  { label: '배송 중', subtitle: '', Icon: Process3Icon },
  { label: '배송 완료', subtitle: '', Icon: Process4Icon },
  { label: '구매 확정', subtitle: '', Icon: Process5Icon },
];

const BUYER_INFO = {
  name: '이수진',
  phone: '010-1234-5678',
  address: '(12345) 경기도 화성시 병점구 안녕동\n12345678923456789234567812345678912345612345678',
  requestLabel: '배송시 요청사항',
  requestValue: '문 앞에 놓아주세요',
};

const PurchaseOrderDetailScreen = ({ navigation, route }: Props) => {
  const { orderNumber, productTitle, productPrice, productImage } = route.params;
  const currentStepIndex = 0;
  const currentStep = PROCESS_STEPS[currentStepIndex];
  const [isPriceExpanded, setPriceExpanded] = useState(false);
  const [isAddressExpanded, setAddressExpanded] = useState(false);
  const [isShippingExpanded, setShippingExpanded] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="주문 상세" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.processContainer}>
          <Text style={styles.processTitle}>{currentStep.label}</Text>
          <Text style={styles.processSubtitle}>{currentStep.subtitle}</Text>

          <View style={styles.processStepsRow}>
            {PROCESS_STEPS.map((step, index) => {
              const StepIcon = step.Icon;
              const isActive = index === currentStepIndex;
              return (
                <View key={step.label} style={styles.processStep}>
                  <View style={[styles.processCircle, isActive && styles.processCircleActive]}>
                    <StepIcon width={16} height={16} />
                  </View>
                  <Text style={[styles.processStepLabel, !isActive && styles.processStepLabelInactive]}>{step.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.orderContainer}>
          <View style={styles.orderHeaderRow}>
            <Text style={styles.orderTitle}>주문 상품</Text>
            <Text style={styles.orderNumberText}>주문번호 {orderNumber}</Text>
          </View>

          <View style={styles.orderProductRow}>
            <Image source={productImage} style={styles.orderProductImage} resizeMode="cover" />
            <View style={styles.orderProductInfo}>
              <Text style={styles.orderProductTitle}>{productTitle}</Text>
              <Text style={styles.orderProductPrice}>{productPrice.toLocaleString()}원</Text>
            </View>
          </View>

          {isPriceExpanded && (
            <View style={styles.priceBreakdownContainer}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>상품금액</Text>
                <Text style={styles.breakdownValue}>45,000원</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>배송비</Text>
                <Text style={styles.breakdownValue}>5,000원</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>
                  <Text style={styles.breakdownInfoIcon}>ⓘ</Text> 안심결제 이용료
                </Text>
                <Text style={styles.breakdownValue}>1,875원</Text>
              </View>
            </View>
          )}

          <View style={styles.orderDivider} />

          <View style={styles.totalPaymentRow}>
            <Text style={styles.totalPaymentLabel}>총 결제금액</Text>
            <TouchableOpacity
              style={styles.totalPaymentValueGroup}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={() => setPriceExpanded(!isPriceExpanded)}
            >
              <Text style={styles.totalPaymentValue}>51,875원</Text>
              {isPriceExpanded ? (
                <DropdownReIcon width={12} height={10} style={styles.totalPaymentIcon} />
              ) : (
                <DropdownIcon width={12} height={10} style={styles.totalPaymentIcon} />
              )}
            </TouchableOpacity>
          </View>

          {isPriceExpanded && (
            <View style={styles.paymentInfoContainer}>
              <View style={styles.paymentInfoRow}>
                <Text style={styles.paymentInfoLabel}>결제수단</Text>
                <Text style={styles.paymentInfoValue}>신용카드</Text>
              </View>
              <View style={styles.paymentInfoRow}>
                <Text style={styles.paymentInfoLabel}>결제일시</Text>
                <Text style={styles.paymentInfoValue}>2026.08.12  14:20</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionButtonText}>
              {currentStepIndex === 0 ? '주문취소' : '반품요청'}
            </Text>
          </TouchableOpacity>
          <View style={styles.actionButtonDivider} />
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionButtonText}>상품문의</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buyerContainer}>
          <TouchableOpacity
            style={styles.buyerHeaderRow}
            activeOpacity={0.7}
            onPress={() => setAddressExpanded(!isAddressExpanded)}
          >
            <Text style={styles.buyerTitle}>배송지 정보</Text>
            {isAddressExpanded ? (
              <DropdownReIcon width={12} height={10} />
            ) : (
              <DropdownIcon width={12} height={10} />
            )}
          </TouchableOpacity>

          {isAddressExpanded && (
            <>
              <View style={styles.buyerInfoRow}>
                <Text style={styles.buyerName}>{BUYER_INFO.name}</Text>
                <Text style={styles.buyerPhone}>{BUYER_INFO.phone}</Text>
              </View>

              <Text style={styles.buyerAddressText}>{BUYER_INFO.address}</Text>

              <View style={styles.buyerRequestRow}>
                <Text style={styles.buyerRequestLabel}>{BUYER_INFO.requestLabel}</Text>
                <Text style={styles.buyerRequestValue}>{BUYER_INFO.requestValue}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.shippingInfoContainer}>
          <TouchableOpacity
            style={styles.shippingInfoHeaderRow}
            activeOpacity={0.7}
            onPress={() => setShippingExpanded(!isShippingExpanded)}
          >
            <Text style={styles.shippingInfoTitle}>발송 정보</Text>
            {isShippingExpanded ? (
              <DropdownReIcon width={12} height={10} />
            ) : (
              <DropdownIcon width={12} height={10} />
            )}
          </TouchableOpacity>

          {isShippingExpanded && (
            <View style={styles.shippingInfoRows}>
              <View style={styles.paymentInfoRow}>
                <Text style={styles.paymentInfoLabel}>택배사</Text>
                <Text style={styles.paymentInfoValue}>CJ 대한통운</Text>
              </View>
              <View style={styles.paymentInfoRow}>
                <Text style={styles.paymentInfoLabel}>운송장 번호</Text>
                <Text style={styles.paymentInfoValue}>123456781234567</Text>
              </View>
              <View style={styles.paymentInfoRow}>
                <Text style={styles.paymentInfoLabel}>발송일</Text>
                <Text style={styles.paymentInfoValue}>2026.08.15</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.shippingDeadlineContainer}>
          <Text style={styles.shippingDeadlineTitle}>예상 발송기한</Text>
        </View>

        <View style={styles.noticeContainer}>
          <Text style={styles.noticeTitle}>안내사항</Text>
          <Text style={styles.noticeText}>
            · 결제 완료 후 3영업일 이내 상품을 발송해 주세요.{'\n'}
            · 운송장 등록 후 택배사 집하가 확인되어야 발송 완료 처리됩니다.{'\n'}
            · 5영업일까지 발송하지 않으면 주문이 자동 취소됩니다.{'\n'}
            · 구매 확정 후 2영업일 이내 판매자 계좌로 정산됩니다.{'\n'}
            · 반품·환불 또는 분쟁이 접수되면 정산이 보류될 수 있습니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PurchaseOrderDetailScreen;
