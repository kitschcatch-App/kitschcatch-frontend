/**
 * 화면: 스플래시 화면 (SplashScreen)
 * 역할: 앱 실행 시 처음에 나타나는 로딩 화면으로, 로그인 상태를 확인하여 이동할 화면을 결정합니다.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing, Platform, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { secureStorage } from '../../utils/secureStorage';
import { FLAT_SX, FLAT_SY, LOGO_OFFSET_X, LOGO_OFFSET_Y, setSplashLogoY } from '../../utils/splashTransition';

const { width, height } = Dimensions.get('window');
const screenHeight = Dimensions.get('screen').height;
const CIRCLE_SIZE = 45;
// 화면 위 바깥에서 시작 (갑자기 나타나 보이지 않게)
const CIRCLE_START = -height / 2 - CIRCLE_SIZE;
// 떨어지는 동안 위아래로 길쭉한 모습
const FALL_SX = 0.8;
const FALL_SY = 1.35;

// 주의: navigation/RootNavigator.ts 파일의 RootStackParamList에 'Splash': undefined; 를 추가해주세요.
type Props = NativeStackScreenProps<RootStackParamList, any>;

const SplashScreen = ({ navigation }: Props) => {
  // 낙하 진행도: 배경 전환 + 동그라미 낙하 → 착지하면 납작한 로고로 교체
  const p = useRef(new Animated.Value(0)).current;
  const logoBoxRef = useRef<View>(null);
  // 실제 화면(상태바·내비게이션바 포함) 정중앙에 맞추기 위한 보정: 컨테이너가 화면 중앙에서 벗어난 만큼
  const [centerShift, setCenterShift] = useState(0);

  // 로고 크기: 납작하게 나온 뒤 스프링으로 원래 크기까지 (위치는 화면 가운데에 고정)
  const sx = useRef(new Animated.Value(FLAT_SX)).current;
  const sy = useRef(new Animated.Value(FLAT_SY)).current;

  useEffect(() => {
    let isMounted = true;

    // 배경 전환 + 원 낙하(약 0.46초) → 착지 시 납작한 로고로 교체 → 위아래로 늘어났다 웅크렸다 원래 크기로
    const anim = Animated.sequence([
      Animated.timing(p, { toValue: 1, duration: 460, easing: Easing.linear, useNativeDriver: false }),
      Animated.parallel([sx, sy].map(v =>
        Animated.spring(v, { toValue: 1, stiffness: 300, damping: 14, mass: 1, useNativeDriver: false }),
      )),
    ]);

    // 애니메이션은 바로 시작하고, 토큰 확인은 병렬로 진행
    const tokenPromise = secureStorage.getItem('accessToken');
    anim.start(async ({ finished }) => {
      await tokenPromise; // 토큰 있으면 메인, 없으면 로그인 (분기는 아래 주석 참고)
      if (!finished || !isMounted) return;
      // 로그인 되어 있으면 자동으로 홈(ProductList)으로 이동하는 로직 (임시 주석 처리)
      // navigation.replace((await tokenPromise) ? 'ProductList' : 'Login');
      navigation.replace('Login'); // 이어서 로그인 화면에서 위로 튀어오름
    });

    return () => {
      isMounted = false;
      anim.stop();
    };
  }, [navigation, p, sx, sy]);

  const bezier = Easing.bezier(0.5, 0, 0.5, 1);
  const backgroundColor = p.interpolate({
    inputRange: [0, 1],
    outputRange: ['#CBF9F5', '#FFFFFF'],
    easing: bezier,
  });
  // 흰 배경이 되는 순간 원은 민트색으로 (배경과 반대 색이라 계속 보임)
  const circleColor = p.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#CBF9F5'],
    easing: bezier,
  });
  // 중력처럼 점점 빨라지며 화면 가운데(로고 자리)로 떨어짐
  const circleY = p.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCLE_START, 0],
    easing: Easing.in(Easing.quad),
  });
  // 착지하는 순간 원 → 납작한 로고로 교체
  const circleOpacity = p.interpolate({ inputRange: [0, 0.98, 1], outputRange: [1, 1, 0] });
  const logoOpacity = p.interpolate({ inputRange: [0, 0.98, 1], outputRange: [0, 0, 1] });

  return (
    <Animated.View
      style={[styles.container, { backgroundColor }]}
      onLayout={e => {
        // 상태바가 컨테이너 밖에 있는 경우(window < screen) 컨테이너 상단은 상태바 높이만큼 아래
        const top = Platform.OS === 'android' && screenHeight > height ? StatusBar.currentHeight ?? 0 : 0;
        setCenterShift(screenHeight / 2 - (top + e.nativeEvent.layout.height / 2));
      }}
    >
      <View
        ref={logoBoxRef}
        style={[styles.logo, { marginTop: centerShift * 2 }]}
        onLayout={() => logoBoxRef.current?.measureInWindow((_x, y) => setSplashLogoY(y))}
      >
        <Animated.View style={[styles.center, { opacity: circleOpacity, transform: [{ translateY: circleY }, { scaleX: FALL_SX }, { scaleY: FALL_SY }] }]}>
          <Animated.View style={[styles.circle, { backgroundColor: circleColor }]} />
        </Animated.View>
        <Animated.Image
          source={require('../../assets/logo.png')}
          style={[styles.logoImage, { opacity: logoOpacity, transform: [{ translateX: width * 0.4 * LOGO_OFFSET_X }, { translateY: width * 0.4 * LOGO_OFFSET_Y }, { scaleX: sx }, { scaleY: sy }] }]}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',     
    alignItems: 'center',          
  },
  logo: {
    width: width * 0.4, // 기기 화면 너비의 40% 크기로 설정
    aspectRatio: 1,
  },
  center: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
  logoImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;