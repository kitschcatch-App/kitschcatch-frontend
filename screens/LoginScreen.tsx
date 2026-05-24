import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { styles } from './LoginScreen.styles';
import KitschcatchIcon from '../assets/kitschcatch.svg';
import KakaoIcon from '../assets/kakao.svg';
import Svg, { Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg';
import { login, getProfile as getKakaoProfile } from '@react-native-seoul/kakao-login';
import { authAPI } from '../api/apiClient';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const handleKakaoLogin = async () => {
    try {
      // 1. 카카오 로그인 수행 및 토큰 발급
      const token = await login();
      console.log('카카오 로그인 토큰:', token);
      
      // 2. 백엔드로 카카오 액세스 토큰 전송 (백엔드 API가 준비되면 주석 해제하여 사용하세요)
      /*
      const response = await authAPI.loginWithKakao(token.accessToken);
      console.log('백엔드 로그인 성공:', response.data);
      
      // 3. 백엔드에서 받은 앱 자체 토큰(JWT)을 기기에 저장 (나중에 AsyncStorage 설치 후 사용)
      // await AsyncStorage.setItem('userToken', response.data.token);
      */

      // 4. 모든 처리가 완료되면 메인 화면으로 이동
      navigation.replace('ProductList');
    } catch (err: any) {
      if (err.message && err.message.includes('user cancelled')) {
        console.log('사용자가 카카오 로그인을 취소했습니다.');
        // 사용자가 취소한 경우 별도 처리 없이 조용히 넘어갑니다.
      } else {
        console.error('카카오 로그인 에러:', err);
        // TODO: 실제 에러 발생 시 사용자에게 알림(Alert 등) 띄우기
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
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;