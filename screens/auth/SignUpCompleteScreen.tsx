/**
 * 화면: 회원가입 완료 화면 (SignUpCompleteScreen)
 * 역할: 회원가입 절차를 모두 마친 사용자에게 완료 안내를 보여주고 홈 화면으로 이동시키는 화면입니다.
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './SignUpCompleteScreen.styles';
import BackIcon from '../../assets/back.svg';
import CheckIcon from '../../assets/check.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUpComplete'>;

const SignUpCompleteScreen = ({ navigation, route }: Props) => {
  const { nickname } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 헤더: 뒤로가기 & 타이틀 */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <BackIcon width={10} height={18} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>회원가입</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* 완료 안내 */}
        <View style={styles.contentContainer}>
          <Text style={styles.completeText}>{nickname} 님의{'\n'}회원가입이 완료되었습니다!</Text>
          <CheckIcon width={148} height={90} />

          {/* 홈 화면으로 이동 버튼 */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => navigation.replace('ProductList')}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>홈 화면으로 이동</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUpCompleteScreen;
