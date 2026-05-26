import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// 주의: navigation/RootNavigator.ts 파일의 RootStackParamList에 'Splash': undefined; 를 추가해주세요.
type Props = NativeStackScreenProps<RootStackParamList, any>;

const SplashScreen = ({ navigation }: Props) => {
  // 애니메이션을 위한 값 초기화 (0: 투명, 1: 불투명)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;
    let timer: ReturnType<typeof setTimeout>;

    const checkAndNavigate = async () => {
      // AsyncStorage에서 토큰 존재 여부 확인 → 있으면 메인, 없으면 로그인
      const token = await AsyncStorage.getItem('accessToken');

      if (!isMounted) return;

      // 1. 화면이 켜지면 0.5초 동안 로고가 서서히 나타남 (Fade In)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // 2. 2초 동안 띄워둔 후, 0.5초 동안 로고가 서서히 사라짐 (Fade Out)
      timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          if (isMounted) {
            navigation.replace(token ? 'ProductList' : 'Login');
          }
        });
      }, 2000);
    };

    checkAndNavigate();

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [navigation, fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white, 
    justifyContent: 'center',     
    alignItems: 'center',          
  },
  logo: {
    width: width * 0.4, // 기기 화면 너비의 40% 크기로 설정
    height: undefined,  
    aspectRatio: 1,     
  },
});

export default SplashScreen;