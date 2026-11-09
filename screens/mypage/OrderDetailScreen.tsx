/**
 * 화면: 주문 상세 화면 (OrderDetailScreen)
 * 역할: 판매내역에서 상품을 선택했을 때 주문의 진행 상태를 단계별로 보여주는 화면입니다.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './OrderDetailScreen.styles';
import { orderAPI } from '../../api/apiClient';
import { useRefreshControl } from '../../hooks/useRefreshControl';
import { CARRIERS, getOrderProgress } from '../../utils/mypage';
import { colors } from '../../styles/colors';
import ScreenHeader from '../../components/ScreenHeader';
import CommonDropdown from '../../components/CommonDropdown';
import CommonInput from '../../components/CommonInput';
import DatePickerModal, { SelectedDate } from '../../components/DatePickerModal';
import Process1Icon from '../../assets/process1.svg';
import Process2Icon from '../../assets/process2.svg';
import Process3Icon from '../../assets/process3.svg';
import Process4Icon from '../../assets/process4.svg';
import Process5Icon from '../../assets/process5.svg';
import CalendarIcon from '../../assets/calendar.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

const PROCESS_STEPS = [
  { label: '결제 완료', subtitle: '결제 이후 3영업일 이내 상품을 발송해주세요.', Icon: Process1Icon },
  { label: '배송 준비', subtitle: '', Icon: Process2Icon },
  { label: '배송 중', subtitle: '', Icon: Process3Icon },
  { label: '배송 완료', subtitle: '', Icon: Process4Icon },
  { label: '구매 확정', subtitle: '', Icon: Process5Icon },
];

const parseShipDate = (value: string): SelectedDate | null => {
  const match = value.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
};

const BUYER_INFO = {
  name: '이수진',
  phone: '010-1234-5678',
  address: '(12345) 경기도 화성시 병점구 안녕동\n12345678923456789234567812345678912345612345678',
  requestLabel: '배송시 요청사항',
  requestValue: '문 앞에 놓아주세요',
};

const formatDate = (iso: string) => iso.slice(0, 10).replace(/-/g, '.');

const COURIER_OPTIONS = CARRIERS.map(c => c.label);

const OrderDetailScreen = ({ navigation, route }: Props) => {
  const { orderId, orderNumber, productTitle, productPrice, productImage } = route.params;
  const [order, setOrder] = useState<any>(null);

  const [selectedCourier, setSelectedCourier] = useState('택배사 선택');
  const [isCourierExpanded, setCourierExpanded] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipDate, setShipDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 최초 주문 조회 중
  const [isEditing, setIsEditing] = useState(false); // 등록된 송장 수정 중

  const loadOrder = useCallback(async () => {
    try {
      const res = await orderAPI.getOrder(orderId);
      setOrder(res.data.data);
    } catch (e) {
      console.error('주문 상세 조회 실패:', e);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);
  const refreshControl = useRefreshControl(loadOrder);

  const shipment = order?.shipment ?? null;
  const locked = !!shipment && !isEditing; // 등록된 송장은 수정 모드에서만 입력 가능
  const progress = getOrderProgress(order ?? { status: 'PAID' });
  const currentStep = PROCESS_STEPS[Math.max(progress.index, 0)];
  const title = order?.post?.title ?? productTitle;
  const price = order?.amount ?? productPrice;
  const image = order?.post?.thumbnailUrl ? { uri: order.post.thumbnailUrl } : productImage;

  const isRegisterEnabled =
    !isRegistering && !shipment && order?.status === 'PAID' && selectedCourier !== '택배사 선택' && trackingNumber.trim() !== '';

  const isSaveEnabled = !isRegistering && selectedCourier !== '택배사 선택' && trackingNumber.trim() !== '';

  const startEditing = () => {
    setSelectedCourier(shipment.carrierName);
    setTrackingNumber(shipment.trackingNumber);
    setIsEditing(true);
  };

  // 최초 등록(POST)과 수정(PATCH)을 같은 핸들러로 처리
  const handleRegisterShipment = async () => {
    const carrier = CARRIERS.find(c => c.label === selectedCourier);
    if (!carrier || !(isEditing ? isSaveEnabled : isRegisterEnabled)) return;
    setIsRegistering(true);
    try {
      const body = { carrierCode: carrier.code, trackingNumber: trackingNumber.trim() };
      if (isEditing) await orderAPI.updateShipment(orderId, body);
      else await orderAPI.registerShipment(orderId, body);
      setIsEditing(false);
      await loadOrder();
    } catch (err: any) {
      const status = err.response?.status;
      Alert.alert(
        '발송 정보 등록',
        status === 400
          ? '택배사 또는 운송장 번호(하이픈 없는 숫자 8~40자리)를 확인해주세요.'
          : status === 409
            ? isEditing
              ? '구매확정되었거나 환불 처리 중인 주문은 운송장을 수정할 수 없어요.'
              : '이미 다른 운송장이 등록되었거나 등록할 수 없는 주문 상태예요.'
            : '등록 중 오류가 발생했어요. 다시 시도해주세요.',
      );
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenHeader title="주문 상세" onBack={() => navigation.goBack()} />
        <ActivityIndicator style={styles.loadingIndicator} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="주문 상세" onBack={() => navigation.goBack()} />

      <ScrollView refreshControl={refreshControl} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.processContainer}>
          <Text style={styles.processTitle}>{progress.title ?? currentStep.label}</Text>
          <Text style={styles.processSubtitle}>{progress.title ? '' : currentStep.subtitle}</Text>

          <View style={styles.processStepsRow}>
            {PROCESS_STEPS.map((step, index) => {
              const StepIcon = step.Icon;
              const isActive = index === progress.index;
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
            <Text style={styles.orderNumberText}>주문번호 {order?.orderId ?? orderNumber}</Text>
          </View>

          <View style={styles.orderProductRow}>
            <Image source={image} style={styles.orderProductImage} resizeMode="cover" />
            <View style={styles.orderProductInfo}>
              <Text style={styles.orderProductTitle}>{title}</Text>
              <Text style={styles.orderProductPrice}>{price.toLocaleString()}원</Text>
            </View>
          </View>
        </View>

        <View style={styles.buyerContainer}>
          <Text style={styles.buyerTitle}>구매자 정보</Text>

          <View style={styles.buyerInfoRow}>
            <Text style={styles.buyerName}>{BUYER_INFO.name}</Text>
            <Text style={styles.buyerPhone}>{BUYER_INFO.phone}</Text>
          </View>

          <Text style={styles.buyerAddressText}>{BUYER_INFO.address}</Text>

          <View style={styles.buyerRequestRow}>
            <Text style={styles.buyerRequestLabel}>{BUYER_INFO.requestLabel}</Text>
            <Text style={styles.buyerRequestValue}>{BUYER_INFO.requestValue}</Text>
          </View>

          <TouchableOpacity style={styles.contactButton} activeOpacity={0.7}>
            <Text style={styles.contactButtonText}>구매자에게 문의하기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.shippingContainer}>
          <Text style={styles.shippingTitle}>발송 정보</Text>

          <View style={styles.deadlineBox}>
            <View style={styles.deadlineRow}>
              <Text style={styles.deadlineLabel}>발송기한</Text>
              <Text style={styles.deadlineValue}>2026.08.17(월) 23:59 까지</Text>
            </View>
            <Text style={styles.deadlineDescText}>결제 이후 3영업일 이내 상품을 발송해주세요.</Text>
          </View>

          <View style={styles.formRowTop}>
            <Text style={[styles.formLabel, styles.formLabelTop]}>택배사</Text>
            <CommonDropdown
              label=""
              value={locked ? shipment.carrierName : selectedCourier}
              options={locked ? [] : COURIER_OPTIONS}
              placeholder="택배사 선택"
              isExpanded={isCourierExpanded}
              onToggle={() => !locked && setCourierExpanded(!isCourierExpanded)}
              onSelect={(option) => {
                setSelectedCourier(option);
                setCourierExpanded(false);
              }}
              containerStyle={styles.formDropdown}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>운송장</Text>
            <View style={styles.formInputWrapper}>
              <CommonInput
                value={locked ? shipment.trackingNumber : trackingNumber}
                onChangeText={setTrackingNumber}
                editable={!locked}
                keyboardType="number-pad"
                placeholder="운송장 번호 입력"
                placeholderTextColor={colors.gray06}
                containerStyle={styles.formInput}
              />
              <TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
                <Text style={styles.searchButtonText}>조회</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>발송일</Text>
            <TouchableOpacity
              style={styles.dateInputWrapper}
              activeOpacity={0.7}
              onPress={() => !shipment && setDatePickerVisible(true)}
            >
              <View pointerEvents="none">
                <CommonInput
                  value={shipment?.shippedAt ? formatDate(shipment.shippedAt) : shipDate}
                  editable={false}
                  placeholder="발송일 입력"
                  placeholderTextColor={colors.gray06}
                  style={styles.dateInput}
                />
              </View>
              <CalendarIcon width={24} height={24} style={styles.calendarIcon} />
            </TouchableOpacity>
          </View>

          {locked ? (
            <TouchableOpacity style={styles.registerButton} activeOpacity={0.7} onPress={startEditing}>
              <Text style={styles.registerButtonText}>운송장 수정하기</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.registerButton, !(isEditing ? isSaveEnabled : isRegisterEnabled) && styles.registerButtonDisabled]}
              activeOpacity={0.7}
              disabled={!(isEditing ? isSaveEnabled : isRegisterEnabled)}
              onPress={handleRegisterShipment}
            >
              <Text style={styles.registerButtonText}>
                {isRegistering ? '저장 중...' : isEditing ? '수정 완료' : '발송 정보 등록하기'}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.shippingNoticeText}>
            · 운송장만 등록된 상태는 실제 발송상태로 인정하지 않습니다.택배사 집하가 확인되어야 발송상태가 인정됩니다.
          </Text>
        </View>

        <View style={styles.trackingGuideContainer}>
          <Text style={styles.trackingGuideTitle}>운송장 등록방법</Text>
        </View>

        <View style={styles.settlementContainer}>
          <Text style={styles.settlementTitle}>예상 정산금액</Text>
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

      <DatePickerModal
        visible={isDatePickerVisible}
        value={parseShipDate(shipDate)}
        onClose={() => setDatePickerVisible(false)}
        onConfirm={({ year, month, day }) => {
          setShipDate(`${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`);
          setDatePickerVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

export default OrderDetailScreen;
