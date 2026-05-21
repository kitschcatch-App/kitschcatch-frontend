import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { styles } from './LoginScreen.styles';
import KitschcatchIcon from '../assets/kitschcatch.svg';
import KakaoIcon from '../assets/kakao.svg';
import Svg, { Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const handleKakaoLogin = () => {
    // TODO: 실제 카카오 로그인 API 연동
    // 임시로 로그인 성공 시 메인 화면(상품 목록)으로 이동하도록 구현
    navigation.replace('ProductList');
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