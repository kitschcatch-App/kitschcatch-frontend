/**
 * 화면: 구매내역 주문 상세 화면 (PurchaseOrderDetailScreen)
 * 역할: 구매내역에서 상품을 선택했을 때 주문의 진행 상태를 단계별로 보여주는 화면입니다.
 */
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './PurchaseOrderDetailScreen.styles';
import { orderAPI, chatAPI } from '../../api/apiClient';
import { getMockCreateChatRoom, mockDelay } from '../../api/mockData';
import { useMockMode } from '../../contexts/MockModeContext';
import {
  formatDateTime,
  formatMonthDayAfter,
  formatShortDate,
  getBuyerOrderAction,
  getOrderProgress,
  getReturnProgress,
  parseRefundReason,
} from '../../utils/mypage';
import { calcSafePaymentFee, SHIPPING_FEE } from '../../utils/payment';
import { useRefreshControl } from '../../hooks/useRefreshControl';
import ScreenHeader from '../../components/ScreenHeader';
import Collapsible from '../../components/Collapsible';
import ConfirmView from '../../components/ConfirmView';
import SuccessView from '../../components/SuccessView';
import DropdownIcon from '../../assets/dropdown.svg';
import DropdownReIcon from '../../assets/dropdown-re.svg';
import Process1Icon from '../../assets/process1.svg';
import Process2Icon from '../../assets/process2.svg';
import Process3Icon from '../../assets/process3.svg';
import Process4Icon from '../../assets/process4.svg';
import Process5Icon from '../../assets/process5.svg';
import Return1Icon from '../../assets/return1.svg';
import Return2Icon from '../../assets/return2.svg';
import Return3Icon from '../../assets/return3.svg';
import Return4Icon from '../../assets/return4.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'PurchaseOrderDetail'>;

const PROCESS_STEPS = [
  { label: '결제 완료', subtitle: '결제가 완료되었어요.', Icon: Process1Icon },
  { label: '배송 준비', subtitle: '', Icon: Process2Icon },
  { label: '배송 중', subtitle: '', Icon: Process3Icon },
  { label: '배송 완료', subtitle: '', Icon: Process4Icon },
  { label: '구매 확정', subtitle: '', Icon: Process5Icon },
];

const RETURN_STEPS = [
  {
    label: '반품 요청',
    subtitle: '반품 요청이 접수되었어요.',
    Icon: Return1Icon,
  },
  {
    label: '판매자 확인',
    subtitle: '판매자가 반품 요청을 확인 중이에요.',
    Icon: Return2Icon,
  },
  {
    label: '회수 진행',
    subtitle: '반품 상품을 회수 중이에요.',
    Icon: Return3Icon,
  },
  { label: '반품 완료', subtitle: '환불이 완료되었어요.', Icon: Return4Icon },
];

const RETURN_NOTICES = [
  '상품 수령 후 7일 이내 반품 접수가 가능합니다.',
  '사용 흔적 및 상품 훼손 시 반품이 제한될 수 있습니다.',
  '반품 사유에 따라 배송비가 부과될 수 있습니다.',
  '상품 검수 완료 후 환불이 진행되며, 결제 수단에 따라 환불까지 영업일 기준 2~5일이 소요될 수 있습니다.',
];

const BUYER_INFO = {
  name: '이수진',
  phone: '010-1234-5678',
  address:
    '(12345) 경기도 화성시 병점구 안녕동\n12345678923456789234567812345678912345612345678',
  requestLabel: '배송시 요청사항',
  requestValue: '문 앞에 놓아주세요',
};

const DEADLINE_NOTICES = [
  '판매자가 상품을 택배사에 접수할 예정인 날짜예요. 실제 도착일은 택배사와 배송 지역에 따라 달라질 수 있어요.',
  '발송 일정이 변경되면 판매자에게 변경 일정을 확인해 주세요.',
];

const PurchaseOrderDetailScreen = ({ navigation, route }: Props) => {
  const { orderId, orderNumber, productTitle, productPrice, productImage } =
    route.params;
  const { isMockMode } = useMockMode();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // 최초 주문 조회 중
  const [isPriceExpanded, setPriceExpanded] = useState(false);
  const [isAddressExpanded, setAddressExpanded] = useState(false);
  const [isShippingExpanded, setShippingExpanded] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

  const loadOrder = useCallback(
    () =>
      orderAPI
        .getOrder(orderId)
        .then(res => setOrder(res.data.data))
        .catch(e => console.error('주문 상세 조회 실패:', e))
        .finally(() => setIsLoading(false)),
    [orderId],
  );

  // 반품요청 화면에서 돌아올 때도 주문 상태를 다시 조회
  useFocusEffect(
    useCallback(() => {
      loadOrder();
    }, [loadOrder]),
  );

  const refreshControl = useRefreshControl(loadOrder);
  const action = order ? getBuyerOrderAction(order) : null;
  const ACTION_LABEL = {
    CANCEL: '주문취소',
    REFUND: '반품요청',
    WITHDRAW: '반품철회',
  };

  // 주문취소·반품철회 실행: 성공하면 주문을 다시 조회한다.
  const run = async () => {
    if (!action || !order) return;
    try {
      if (action === 'CANCEL') {
        const res = await orderAPI.cancelOrder(order.orderId, '단순 변심');
        if (res.data.data?.processing)
          Alert.alert(
            '주문취소',
            '취소 처리 중이에요. 잠시 후 다시 확인해주세요.',
          );
        else setShowCancelSuccess(true);
      } else {
        await orderAPI.withdrawRefund(order.orderId, order.refund.refundId);
      }
      await loadOrder();
    } catch (e: any) {
      console.error('주문 취소/환불 실패:', e);
      const code = e?.response?.data?.error?.code;
      Alert.alert(
        ACTION_LABEL[action],
        code === 'ORDER_005' ||
          code === 'ORDER_006' ||
          code?.startsWith('REFUND')
          ? '현재 상태에서는 처리할 수 없는 주문이에요.'
          : '처리 중 오류가 발생했어요. 다시 시도해주세요.',
      );
    }
  };

  const handleAction = () => {
    if (!action || !order) return;
    if (action === 'CANCEL') {
      setShowCancelConfirm(true);
      return;
    }
    if (action === 'REFUND') {
      navigation.navigate('ReturnRequest', {
        orderId: order.orderId,
        amount: order.amount,
      });
      return;
    }
    Alert.alert(
      ACTION_LABEL[action],
      `${ACTION_LABEL[action]}을(를) 진행할까요?`,
      [
        { text: '아니요', style: 'cancel' },
        { text: '네', onPress: run },
      ],
    );
  };

  // 상품문의: 해당 상품의 판매자와 1:1 채팅방을 만들고(이미 있으면 서버가 기존 방 반환) 이동한다.
  const handleInquiry = async () => {
    const postId = Number(order?.post?.id ?? order?.postId);
    if (!postId) return;
    try {
      let body;
      if (isMockMode) {
        await mockDelay(300);
        body = getMockCreateChatRoom(postId).data;
      } else {
        const res = await chatAPI.createChatRoom(postId);
        body = res.data?.data ?? res.data;
      }
      if (!body.chatRoomId) throw new Error('채팅방 ID를 받지 못했습니다.');
      navigation.navigate('Chat', {
        chatRoomId: body.chatRoomId,
        opponentNickname: body.sellerNickname,
      });
    } catch (e) {
      console.error('상품문의 채팅방 생성 실패:', e);
      Alert.alert('상품문의', '채팅방을 열지 못했어요. 다시 시도해주세요.');
    }
  };

  const shipment = order?.shipment ?? null;
  const deadlineDate = formatMonthDayAfter(order?.payment?.approvedAt, 3);
  // 반품 요청이 접수된 주문은 주문 상세 대신 반품 상세로 보여준다.
  const returnIndex = order ? getReturnProgress(order) : -1;
  const isReturn = returnIndex >= 0;
  const steps = isReturn ? RETURN_STEPS : PROCESS_STEPS;
  const progress = isReturn
    ? { index: returnIndex }
    : getOrderProgress(order ?? { status: 'PAID' });
  const currentStep = steps[Math.max(progress.index, 0)];
  const paymentMethodLabel =
    order?.payment?.method === 'CARD' ? '신용카드' : '';
  const title = order?.post?.title ?? productTitle;
  // order.amount는 상품금액(주문 생성 시 productPrice). 배송비·이용료를 더해 총 결제금액을 만든다.
  const price = order?.amount ?? productPrice;
  const fee = calcSafePaymentFee(price, SHIPPING_FEE);
  const totalPrice = price + SHIPPING_FEE + fee;
  const BREAKDOWN = {
    product: `${price.toLocaleString()}원`,
    shipping: `${SHIPPING_FEE.toLocaleString()}원`,
    fee: `${fee.toLocaleString()}원`,
  };
  const image = order?.post?.thumbnailUrl
    ? { uri: order.post.thumbnailUrl }
    : productImage;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenHeader title={isReturn ? '반품 상세' : '주문 상세'} onBack={() => navigation.goBack()} />
        <ActivityIndicator style={styles.loadingIndicator} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        title={isReturn ? '반품 상세' : '주문 상세'}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        refreshControl={refreshControl}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.processContainer}>
          <Text style={styles.processTitle}>
            {progress.title ?? currentStep.label}
          </Text>
          <Text style={styles.processSubtitle}>
            {progress.title ? '' : currentStep.subtitle}
          </Text>

          <View style={styles.processStepsRow}>
            {steps.map((step, index) => {
              const StepIcon = step.Icon;
              const isActive = index === progress.index;
              return (
                <View key={step.label} style={styles.processStep}>
                  <View
                    style={[
                      styles.processCircle,
                      isActive && styles.processCircleActive,
                    ]}
                  >
                    <StepIcon width={16} height={16} />
                  </View>
                  <Text
                    style={[
                      styles.processStepLabel,
                      !isActive && styles.processStepLabelInactive,
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.orderContainer}>
          <View style={styles.orderHeaderRow}>
            <Text style={styles.orderTitle}>주문 상품</Text>
            <Text style={styles.orderNumberText}>
              주문번호 {order?.orderId ?? orderNumber}
            </Text>
          </View>

          <View style={styles.orderProductRow}>
            <Image
              source={image}
              style={styles.orderProductImage}
              resizeMode="cover"
            />
            <View style={styles.orderProductInfo}>
              <Text style={styles.orderProductTitle}>{title}</Text>
              <Text style={styles.orderProductPrice}>
                {price.toLocaleString()}원
              </Text>
            </View>
          </View>

          {isReturn ? (
            <View style={styles.returnReasonRow}>
              <Text style={styles.returnReasonLabel}>반품 사유</Text>
              <Text style={styles.returnReasonValue}>
                {parseRefundReason(order?.refund?.reason)}
              </Text>
            </View>
          ) : (
            <>
              <Collapsible expanded={isPriceExpanded}>
                <View style={styles.priceBreakdownContainer}>
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>상품금액</Text>
                    <Text style={styles.breakdownValue}>
                      {BREAKDOWN.product}
                    </Text>
                  </View>
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>배송비</Text>
                    <Text style={styles.breakdownValue}>
                      {BREAKDOWN.shipping}
                    </Text>
                  </View>
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>
                      <Text style={styles.breakdownInfoIcon}>ⓘ</Text> 안심결제
                      이용료
                    </Text>
                    <Text style={styles.breakdownValue}>{BREAKDOWN.fee}</Text>
                  </View>
                </View>
              </Collapsible>

              <View style={styles.orderDivider} />

              <View style={styles.totalPaymentRow}>
                <Text style={styles.totalPaymentLabel}>총 결제금액</Text>
                <TouchableOpacity
                  style={styles.totalPaymentValueGroup}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={() => setPriceExpanded(v => !v)}
                >
                  <Text style={styles.totalPaymentValue}>
                    {totalPrice.toLocaleString()}원
                  </Text>
                  {isPriceExpanded ? (
                    <DropdownReIcon
                      width={12}
                      height={10}
                      style={styles.totalPaymentIcon}
                    />
                  ) : (
                    <DropdownIcon
                      width={12}
                      height={10}
                      style={styles.totalPaymentIcon}
                    />
                  )}
                </TouchableOpacity>
              </View>

              <Collapsible expanded={isPriceExpanded}>
                <View style={styles.paymentInfoContainer}>
                  <View style={styles.paymentInfoRow}>
                    <Text style={styles.paymentInfoLabel}>결제수단</Text>
                    <Text style={styles.paymentValueText}>
                      {paymentMethodLabel}
                    </Text>
                  </View>
                  <View style={styles.paymentInfoRow}>
                    <Text style={styles.paymentInfoLabel}>결제일시</Text>
                    <Text style={styles.paymentValueText}>
                      {formatDateTime(order?.payment?.approvedAt)}
                    </Text>
                  </View>
                </View>
              </Collapsible>
            </>
          )}
        </View>

        {isReturn && (
          <View style={styles.orderContainer}>
            <Text style={styles.orderTitle}>환불 정보</Text>
            <View style={styles.priceBreakdownContainer}>
              <View style={styles.breakdownRow}>
                <Text style={styles.refundTotalLabel}>총 결제 금액</Text>
                <Text style={styles.refundTotalValue}>
                  {totalPrice.toLocaleString()}원
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>상품금액</Text>
                <Text style={styles.breakdownValue}>{BREAKDOWN.product}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>배송비</Text>
                <Text style={styles.breakdownValue}>{BREAKDOWN.shipping}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>
                  <Text style={styles.breakdownInfoIcon}>ⓘ</Text> 안심결제
                  이용료
                </Text>
                <Text style={styles.breakdownValue}>{BREAKDOWN.fee}</Text>
              </View>
            </View>
            <View style={styles.orderDivider} />
            <View style={styles.priceBreakdownContainer}>
              <View style={styles.breakdownRow}>
                <Text style={styles.refundAmountLabel}>총 환불금액</Text>
                <Text style={styles.refundAmountValue}>
                  {totalPrice.toLocaleString()}원
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>환불수단</Text>
                <Text style={styles.breakdownValue}>{paymentMethodLabel}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>환불 예정일</Text>
                <Text style={styles.breakdownValue}>
                  반품 완료 후 영업일 기준 2~5일
                </Text>
              </View>
            </View>
          </View>
        )}

        {!isReturn && (
          <>
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.7}
                disabled={!action}
                onPress={handleAction}
              >
                <Text style={styles.actionButtonText}>
                  {action ? ACTION_LABEL[action] : '처리 불가'}
                </Text>
              </TouchableOpacity>
              <View style={styles.actionButtonDivider} />
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.7}
                onPress={handleInquiry}
              >
                <Text style={styles.actionButtonText}>상품문의</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buyerContainer}>
              <TouchableOpacity
                style={styles.buyerHeaderRow}
                activeOpacity={0.7}
                onPress={() => setAddressExpanded(v => !v)}
              >
                <Text style={styles.buyerTitle}>배송지 정보</Text>
                {isAddressExpanded ? (
                  <DropdownReIcon width={12} height={10} />
                ) : (
                  <DropdownIcon width={12} height={10} />
                )}
              </TouchableOpacity>

              <Collapsible expanded={isAddressExpanded}>
                <>
                  <View style={styles.buyerInfoRow}>
                    <Text style={styles.buyerName}>{BUYER_INFO.name}</Text>
                    <Text style={styles.buyerPhone}>{BUYER_INFO.phone}</Text>
                  </View>

                  <Text style={styles.buyerAddressText}>
                    {BUYER_INFO.address}
                  </Text>

                  <View style={styles.buyerRequestRow}>
                    <Text style={styles.buyerRequestLabel}>
                      {BUYER_INFO.requestLabel}
                    </Text>
                    <Text style={styles.buyerRequestValue}>
                      {BUYER_INFO.requestValue}
                    </Text>
                  </View>
                </>
              </Collapsible>
            </View>

            <View style={styles.shippingInfoContainer}>
              <TouchableOpacity
                style={styles.shippingInfoHeaderRow}
                activeOpacity={0.7}
                onPress={() => setShippingExpanded(v => !v)}
              >
                <Text style={styles.shippingInfoTitle}>발송 정보</Text>
                {isShippingExpanded ? (
                  <DropdownReIcon width={12} height={10} />
                ) : (
                  <DropdownIcon width={12} height={10} />
                )}
              </TouchableOpacity>

              <Collapsible expanded={isShippingExpanded}>
                <View style={styles.shippingInfoRows}>
                  <View style={styles.paymentInfoRow}>
                    <Text style={styles.paymentInfoLabel}>택배사</Text>
                    <Text style={styles.paymentInfoValue}>
                      {shipment?.carrierName ?? '발송 전'}
                    </Text>
                  </View>
                  <View style={styles.paymentInfoRow}>
                    <Text style={styles.paymentInfoLabel}>운송장 번호</Text>
                    <Text style={styles.paymentInfoValue}>
                      {shipment?.trackingNumber ?? '-'}
                    </Text>
                  </View>
                  <View style={styles.paymentInfoRow}>
                    <Text style={styles.paymentInfoLabel}>발송일</Text>
                    <Text style={styles.paymentInfoValue}>
                      {shipment?.shippedAt
                        ? formatShortDate(shipment.shippedAt)
                        : '-'}
                    </Text>
                  </View>
                </View>
              </Collapsible>
            </View>
          </>
        )}

        {isReturn ? (
          <View style={styles.noticeContainer}>
            <Text style={styles.noticeTitle}>안내사항</Text>
            <View style={styles.returnNoticeList}>
              {RETURN_NOTICES.map(text => (
                <View key={text} style={styles.returnNoticeRow}>
                  <Text style={styles.deadlineSubDot}>•</Text>
                  <Text style={styles.deadlineSubText}>{text}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <>
            <View style={styles.shippingDeadlineContainer}>
              <Text style={styles.shippingDeadlineTitle}>예상 발송기한</Text>
              {!!deadlineDate && (
                <Text style={styles.deadlineMainText}>
                  <Text style={styles.deadlineDateText}>{deadlineDate}</Text>
                  까지 발송 예정이에요.
                </Text>
              )}
              {DEADLINE_NOTICES.map(text => (
                <View key={text} style={styles.bulletRow}>
                  <Text style={styles.deadlineSubDot}>•</Text>
                  <Text style={styles.deadlineSubText}>{text}</Text>
                </View>
              ))}
            </View>

            <View style={styles.noticeContainer}>
              <Text style={styles.noticeTitle}>안내사항</Text>
              <Text style={styles.noticeText}>
                · 배송 완료 후 7일이 지나면 자동으로 구매 확정됩니다.{'\n'}·
                상품에 문제가 있다면 구매 확정 전에 반품·환불을 신청해 주세요.
                {'\n'}· 구매 확정 후에는 단순 변심에 따른 반품이 제한될 수
                있습니다.{'\n'}· 분쟁 또는 환불 요청이 접수되면 자동 구매 확정이
                중지됩니다.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <ConfirmView
        visible={showCancelConfirm}
        title={
          '주문을 취소하시겠어요?\n취소 후에는 주문을 다시 복구할 수 없습니다.'
        }
        cancelText="이전 화면으로 돌아가기"
        confirmText="주문취소"
        wide
        cancelFontSize={14}
        confirmFontSize={14}
        onCancel={() => setShowCancelConfirm(false)}
        onConfirm={() => {
          setShowCancelConfirm(false);
          run();
        }}
      />

      <SuccessView
        visible={showCancelSuccess}
        title="주문이 취소되었습니다."
        onDismiss={() => setShowCancelSuccess(false)}
      />
    </SafeAreaView>
  );
};

export default PurchaseOrderDetailScreen;
