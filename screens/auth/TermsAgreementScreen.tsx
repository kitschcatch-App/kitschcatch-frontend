/**
 * 화면: 약관 동의 화면 (TermsAgreementScreen)
 * 역할: 신규 회원이 소셜 로그인 후 서비스 이용을 위한 약관에 동의하는 화면입니다.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { createStyles } from './TermsAgreementScreen.styles';
import BackIcon from '../../assets/back.svg';
import KitschcatchIcon from '../../assets/kitschcatch.svg';
import ArrowRightIcon from '../../assets/arrow-right.svg';
import RadioOnIcon from '../../assets/radiobutton-on.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'TermsAgreement'>;

const TermsAgreementScreen = ({ navigation }: Props) => {
  const { height } = useWindowDimensions();
  const styles = createStyles(height);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeLocation, setAgreeLocation] = useState(false);

  const isAllAgreed = agreeTerms && agreePrivacy && agreeLocation;

  const toggleAll = () => {
    const next = !isAllAgreed;
    setAgreeTerms(next);
    setAgreePrivacy(next);
    setAgreeLocation(next);
  };

  const handleNext = () => {
    if (!isAllAgreed) return;
    navigation.navigate('SignUp');
  };

  const renderRadio = (checked: boolean) =>
    checked ? (
      <RadioOnIcon width={20} height={20} style={styles.radioIcon} />
    ) : (
      <View style={styles.radioButton} />
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 헤더: 뒤로가기 & 타이틀 */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
            <BackIcon width={10} height={18} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>약관동의</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* 안내 문구 & 약관 동의 목록: 작은 화면에서 내용이 넘칠 수 있어 스크롤 처리 */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introContainer}>
            <View style={styles.introTitleRow}>
              <KitschcatchIcon width={89} height={24} />
              <Text style={styles.introTitleText}>를</Text>
            </View>
            <Text style={styles.introSubText}>이용하기 위해 약관정보 동의가 필요해요!</Text>
          </View>

          <View style={styles.termsContainer}>
            <TouchableOpacity style={styles.termRow} onPress={toggleAll} activeOpacity={0.8}>
              {renderRadio(isAllAgreed)}
              <Text style={styles.termAllText}>전체동의</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.termRow} onPress={() => setAgreeTerms(v => !v)} activeOpacity={0.8}>
              {renderRadio(agreeTerms)}
              <Text style={styles.termText}>
                <Text style={styles.termRequired}>(필수) </Text>서비스 이용약관 동의
              </Text>
              <ArrowRightIcon width={8} height={14} style={styles.termArrow} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.termRow} onPress={() => setAgreePrivacy(v => !v)} activeOpacity={0.8}>
              {renderRadio(agreePrivacy)}
              <Text style={styles.termText}>
                <Text style={styles.termRequired}>(필수) </Text>개인정보 수집 및 이용 동의
              </Text>
              <ArrowRightIcon width={8} height={14} style={styles.termArrow} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.termRow} onPress={() => setAgreeLocation(v => !v)} activeOpacity={0.8}>
              {renderRadio(agreeLocation)}
              <Text style={styles.termText}>
                <Text style={styles.termRequired}>(필수) </Text>위치기반서비스 이용약관 동의
              </Text>
              <ArrowRightIcon width={8} height={14} style={styles.termArrow} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.termRow} onPress={() => setAgreeLocation(v => !v)} activeOpacity={0.8}>
              {renderRadio(agreeLocation)}
              <Text style={styles.termText}>
                <Text style={styles.termRequired}>(필수) </Text>만 14세 이상입니다.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.termRow} onPress={() => setAgreeLocation(v => !v)} activeOpacity={0.8}>
              {renderRadio(agreeLocation)}
              <Text style={styles.termText}>
                <Text style={styles.termOptional}>(선택) </Text>마케팅 정보 수신 동의
              </Text>
              <ArrowRightIcon width={8} height={14} style={styles.termArrow} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 다음 버튼 */}
        <TouchableOpacity
          style={[styles.nextButton, isAllAgreed && styles.nextButtonActive]}
          onPress={handleNext}
          activeOpacity={isAllAgreed ? 0.8 : 1}
          disabled={!isAllAgreed}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TermsAgreementScreen;
