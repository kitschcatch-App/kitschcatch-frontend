/**
 * 화면: 회원탈퇴 (WithdrawScreen)
 * 역할: 탈퇴 사유 선택(reason) → 주의사항 동의(notice) 순으로 진행되는 회원탈퇴 화면입니다.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './WithdrawScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';
import CommonDropdown from '../../components/CommonDropdown';
import SuccessView from '../../components/SuccessView';
import KitschcatchLogo from '../../assets/kitschcatch.svg';
import NextIcon from '../../assets/next.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Withdraw'>;

type Step = 'reason' | 'notice';

const REASON_PLACEHOLDER = '탈퇴이유 선택';
const REASON_OPTIONS = [
  '원하는 상품을 찾기 어려워서',
  '상품이나 거래 정보가 부족해서',
  '이용 방법이 불편해서',
  '거래 과정이 불편해서',
  '서비스 이용이 많지 않아서',
];

const NOTICE_ITEMS = [
  '법령에 따라 거래 및 결제 관련 기록은 일정 기간 보관될 수 있습니다.',
  '탈퇴 시 회원님의 개인정보는 삭제됩니다.',
  '탈퇴 후에는 계정 및 서비스 이용 기록을 복구할 수 없습니다.',
  '진행 중인 거래가 있는 경우 거래 완료 후 탈퇴해주세요.',
];

const WithdrawScreen = ({ navigation }: Props) => {
  const [step, setStep] = useState<Step>('reason');
  const [reason, setReason] = useState(REASON_PLACEHOLDER);
  const [isExpanded, setExpanded] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSuccessVisible, setSuccessVisible] = useState(false);

  const isSelected = reason !== REASON_PLACEHOLDER;

  const handleBack = () => {
    if (step === 'notice') {
      setStep('reason');
      return;
    }
    navigation.goBack();
  };

  const handleNext = () => {
    if (!isSelected) {
      setShowError(true);
      return;
    }
    setStep('notice');
  };

  const handleWithdraw = () => {
    // TODO: 회원탈퇴 API 연동
    setSuccessVisible(true);
  };

  const handleSuccessDismiss = () => {
    setSuccessVisible(false);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="회원탈퇴" onBack={handleBack} />

      {step === 'reason' ? (
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <KitschcatchLogo width={89} height={24} />
            <Text style={styles.titleText}>정말 탈퇴하시나요?</Text>
          </View>

          <Text style={styles.subText}>탈퇴하시는 이유를 알려주세요.</Text>

          <CommonDropdown
            label=""
            value={reason}
            options={REASON_OPTIONS}
            placeholder={REASON_PLACEHOLDER}
            isExpanded={isExpanded}
            onToggle={() => setExpanded(!isExpanded)}
            onSelect={(option) => {
              setReason(option);
              setExpanded(false);
              setShowError(false);
            }}
            containerStyle={styles.dropdown}
            buttonStyle={showError && !isSelected ? styles.dropdownButtonError : undefined}
          />
          {showError && !isSelected && <Text style={styles.errorText}>탈퇴이유를 선택해주세요</Text>}

          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={[styles.nextButton, !isSelected && styles.nextButtonDisabled]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={[styles.nextButtonText, !isSelected && styles.nextButtonTextDisabled]}>다음</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.noticeTitle}>탈퇴 시 주의사항</Text>

          <View style={styles.noticeList}>
            {NOTICE_ITEMS.map((item, index) => (
              <Text key={item} style={[styles.noticeItem, index > 0 && styles.noticeItemSpacing]}>
                {item}
              </Text>
            ))}
          </View>

          <TouchableOpacity style={styles.policyRow} activeOpacity={0.7}>
            <Text style={styles.policyText}>탈퇴 시 개인정보 및 서비스 이용 기록 처리 정책 자세히보기</Text>
            <NextIcon width={6} height={9} />
          </TouchableOpacity>

          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.nextButton} onPress={handleWithdraw} activeOpacity={0.8}>
              <Text style={styles.nextButtonText}>동의하고 탈퇴하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <SuccessView
        visible={isSuccessVisible}
        title="회원탈퇴가 완료되었습니다."
        onDismiss={handleSuccessDismiss}
      />
    </SafeAreaView>
  );
};

export default WithdrawScreen;
