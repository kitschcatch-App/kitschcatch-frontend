/**
 * 화면: 주문 상세 화면 (OrderDetailScreen)
 * 역할: 판매내역에서 상품을 선택했을 때 주문의 진행 상태를 단계별로 보여주는 화면입니다.
 */
import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './OrderDetailScreen.styles';
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

const COURIER_OPTIONS = ['A사', 'B사', 'C사', 'D사'];

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

const OrderDetailScreen = ({ navigation, route }: Props) => {
  const { orderNumber, productTitle, productPrice, productImage } = route.params;
  const currentStepIndex = 0;
  const currentStep = PROCESS_STEPS[currentStepIndex];

  const [selectedCourier, setSelectedCourier] = useState('택배사 선택');
  const [isCourierExpanded, setCourierExpanded] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipDate, setShipDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const isRegisterEnabled =
    selectedCourier !== '택배사 선택' && trackingNumber.trim() !== '' && shipDate.trim() !== '';

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
              value={selectedCourier}
              options={COURIER_OPTIONS}
              placeholder="택배사 선택"
              isExpanded={isCourierExpanded}
              onToggle={() => setCourierExpanded(!isCourierExpanded)}
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
                value={trackingNumber}
                onChangeText={setTrackingNumber}
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
              onPress={() => setDatePickerVisible(true)}
            >
              <View pointerEvents="none">
                <CommonInput
                  value={shipDate}
                  editable={false}
                  placeholder="발송일 입력"
                  placeholderTextColor={colors.gray06}
                  style={styles.dateInput}
                />
              </View>
              <CalendarIcon width={24} height={24} style={styles.calendarIcon} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.registerButton, !isRegisterEnabled && styles.registerButtonDisabled]}
            activeOpacity={0.7}
            disabled={!isRegisterEnabled}
          >
            <Text style={styles.registerButtonText}>발송 정보 등록하기</Text>
          </TouchableOpacity>

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
