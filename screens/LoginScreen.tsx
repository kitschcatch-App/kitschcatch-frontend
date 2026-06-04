/**
 * 화면: 로그인 화면 (LoginScreen)
 * 역할: 카카오 소셜 로그인을 통해 앱에 접속하고 인증 토큰을 발급받는 화면입니다.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { styles } from './LoginScreen.styles';
import KitschcatchIcon from '../assets/kitschcatch.svg';
import KakaoIcon from '../assets/kakao.svg';
import Svg, { Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg';
import { login, loginWithNewScopes } from '@react-native-seoul/kakao-login';
import { authAPI } from '../api/apiClient';
import { secureStorage } from '../utils/secureStorage';
import ErrorView from '../components/ErrorView';
import SuccessView from '../components/SuccessView';
import { ERROR_MESSAGES, ErrorMessage } from '../constants/errorMessages';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [errorMsg, setErrorMsg] = useState<ErrorMessage | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleKakaoLogin = async () => {
    try {
      // Step 1: 서버에서 카카오 OIDC 검증용 Nonce 발급
      const nonceRes = await authAPI.getNonce();
      const nonce: string = nonceRes.data.data.nonce;

      // Step 2: Nonce를 포함하여 카카오 로그인 → ID Token 발급
      const kakaoToken = await login({ nonce });
      const idToken = kakaoToken.idToken;

      if (!idToken) {
        // 카카오 앱 설정에서 "OpenID Connect 활성화"가 꺼져 있으면 idToken이 없을 수 있음
        throw new Error('카카오 ID Token을 받지 못했습니다. 카카오 개발자 콘솔에서 OpenID Connect 활성화를 확인하세요.');
      }

      // Step 3: 백엔드로 ID Token + Nonce 전송 → 앱 JWT(Access/Refresh Token) 발급
      const response = await authAPI.loginWithKakao(idToken, nonce);
      const { accessToken, refreshToken } = response.data.data;

      // Step 4: 발급받은 토큰을 기기에 저장
      await secureStorage.setItem('accessToken', accessToken);
      await secureStorage.setItem('refreshToken', refreshToken);
      await secureStorage.setItem('userId', String(response.data.data.user.id));

      // Step 5: 메인 화면으로 이동
      setShowSuccess(true);
    } catch (err: any) {
      if (err.message?.includes('user cancelled')) {
        setErrorMsg(ERROR_MESSAGES.AUTH.CANCELLED);
      } else if (err.isAxiosError && !err.response) {
        console.error('[Login] 네트워크 에러 (응답 없음):', err.message, err.code);
        setErrorMsg(ERROR_MESSAGES.AUTH.NETWORK);
      } else {
        const serverError = err.response?.data;
        console.error('[Login] 카카오 로그인 에러:', err.message);
        console.error('[Login] HTTP 상태 코드:', err.response?.status);
        console.error('[Login] 서버 에러 응답:', JSON.stringify(serverError, null, 2));
        if (serverError?.error?.code === 'AUTH_002') {
          // 이메일 동의 미완료 → 동의 팝업 표시 후 새 nonce로 재로그인
          try {
            await loginWithNewScopes(['account_email']);
            const retryNonceRes = await authAPI.getNonce();
            const retryNonce: string = retryNonceRes.data.data.nonce;
            const retryToken = await login({ nonce: retryNonce });
            if (!retryToken.idToken) throw new Error('idToken 없음');
            const retryResponse = await authAPI.loginWithKakao(retryToken.idToken, retryNonce);
            const { accessToken, refreshToken } = retryResponse.data.data;
            await secureStorage.setItem('accessToken', accessToken);
            await secureStorage.setItem('refreshToken', refreshToken);
            await secureStorage.setItem('userId', String(retryResponse.data.data.user.id));
            setShowSuccess(true);
          } catch (retryErr: any) {
            console.error('[Login] 이메일 동의 재시도 에러:', retryErr?.message);
            console.error('[Login] 재시도 에러 응답:', JSON.stringify(retryErr?.response?.data, null, 2));
            setErrorMsg(ERROR_MESSAGES.AUTH.EMAIL_CONSENT);
          }
        } else if (serverError?.error?.code === 'AUTH_004') {
          setErrorMsg(ERROR_MESSAGES.AUTH.EMAIL_CONSENT);
        } else {
          setErrorMsg(ERROR_MESSAGES.AUTH.FAILED);
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 중앙 상단 영역: 로고, 타이틀, 서브타이틀 */}
        <View style={styles.contentContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Svg width={width * 0.5} height={24} style={{ marginTop: -26 }}>
            <Defs>
              <RadialGradient id="shadow" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor="#000" stopOpacity="0.28" />
                <Stop offset="100%" stopColor="#000" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Ellipse cx={width * 0.25} cy={12} rx={width * 0.22} ry={10} fill="url(#shadow)" />
          </Svg>
          <KitschcatchIcon width={119} height={48} />
          <Text style={styles.subtitle}>굿즈를 캐치하는 즐거운 순간</Text>
        </View>

        {/* 하단 영역: 로그인 버튼 */}
        <TouchableOpacity style={styles.kakaoButton} onPress={handleKakaoLogin} activeOpacity={0.8}>
          <KakaoIcon width={26} height={24} style={styles.kakaoIcon} />
          <Text style={styles.kakaoButtonText}>카카오 로그인하기</Text>
        </TouchableOpacity>

        {/* 개발자 전용: API 테스트 화면 진입 버튼 */}
        <TouchableOpacity
          style={styles.devTestButton}
          onPress={() => navigation.navigate('ApiTest')}
          activeOpacity={0.7}
        >
          {/* <Text style={styles.devTestButtonText}>🛠 API 연동 테스트</Text> */}
        </TouchableOpacity>
      </View>

      <ErrorView
        visible={!!errorMsg}
        title={errorMsg?.title ?? ''}
        subtitle={errorMsg?.subtitle ?? ''}
        onPress={() => setErrorMsg(null)}
      />

      <SuccessView
        visible={showSuccess}
        title="로그인이 완료되었습니다."
        onDismiss={() => {
          setShowSuccess(false);
          navigation.replace('ProductList');
        }}
      />
    </SafeAreaView>
  );
};

export default LoginScreen;