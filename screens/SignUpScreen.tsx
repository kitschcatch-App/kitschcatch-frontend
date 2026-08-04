/**
 * 화면: 회원가입 화면 (SignUpScreen)
 * 역할: 아이디, 닉네임, 프로필 사진, 한줄소개를 순서대로 입력받아 회원가입을 완료하는 화면입니다.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Asset } from 'react-native-image-picker';
import { RootStackParamList } from '../navigation/RootNavigator';
import { styles } from './SignUpScreen.styles';
import BackIcon from '../assets/back.svg';
import UsernameStep from './signup-steps/UsernameStep';
import NicknameStep from './signup-steps/NicknameStep';
import ProfileImageStep from './signup-steps/ProfileImageStep';
import BioStep from './signup-steps/BioStep';
import StepProgressBar from './signup-steps/StepProgressBar';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const TOTAL_STEPS = 4;

const SignUpScreen = ({ navigation }: Props) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState<Asset | null>(null);
  const [bio, setBio] = useState('');
  const [attemptedNext, setAttemptedNext] = useState(false);

  useEffect(() => {
    setAttemptedNext(false);
  }, [step]);

  const isStepValid = (() => {
    switch (step) {
      case 1:
        return username.trim().length > 0;
      case 2:
        return nickname.trim().length > 0;
      case 3:
        return profileImage !== null;
      case 4:
        return bio.trim().length > 0;
      default:
        return false;
    }
  })();

  const handleBack = () => {
    if (step === 1) {
      navigation.navigate('TermsAgreement');
      return;
    }
    setStep(prev => prev - 1);
  };

  const advanceStep = () => {
    if (step === TOTAL_STEPS) {
      // TODO: 회원가입 API 연동 (username, nickname, profileImage, bio)
      navigation.replace('SignUpComplete', { nickname });
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleNext = () => {
    if (!isStepValid) {
      setAttemptedNext(true);
      return;
    }
    advanceStep();
  };

  // 건너뛰기: 유효성 검사 없이 다음 단계로 이동 (프로필 사진 / 한줄소개는 나중에 등록 가능)
  const handleSkip = () => advanceStep();

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <UsernameStep value={username} onChange={setUsername} showError={attemptedNext && !isStepValid} />;
      case 2:
        return <NicknameStep value={nickname} onChange={setNickname} showError={attemptedNext && !isStepValid} />;
      case 3:
        return (
          <ProfileImageStep value={profileImage} onChange={setProfileImage} showError={attemptedNext && !isStepValid} />
        );
      case 4:
        return <BioStep value={bio} onChange={setBio} showError={attemptedNext && !isStepValid} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 헤더: 뒤로가기 & 타이틀 (뒤로가기는 이전 스텝으로 이동) */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <BackIcon width={20} height={30} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>회원가입</Text>
          {step === 3 || step === 4 ? (
            <TouchableOpacity style={styles.headerRightSlot} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>건너뛰기</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerSpacer} />
          )}
        </View>

        {/* 단계 진행 바 */}
        <StepProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

        {/* 스텝별 입력 영역 */}
        {renderStepContent()}

        {/* 다음 버튼 */}
        <TouchableOpacity
          style={[styles.nextButton, isStepValid && styles.nextButtonActive]}
          onPress={handleNext}
          activeOpacity={isStepValid ? 0.8 : 1}
        >
          <Text style={styles.nextButtonText}>{step === TOTAL_STEPS ? '완료' : '다음'}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
