/**
 * 화면: 로그아웃 (LogoutScreen)
 * 역할: 로그아웃 여부를 확인하고, 로그아웃 완료 시 로그인 화면으로 이동시키는 화면입니다.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './LogoutScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';
import SuccessView from '../../components/SuccessView';
import LogoutImage from '../../assets/logout.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Logout'>;

const LogoutScreen = ({ navigation }: Props) => {
  const [isSuccessVisible, setSuccessVisible] = useState(false);

  const handleLogout = () => {
    // TODO: 로그아웃 API 연동
    setSuccessVisible(true);
  };

  const handleSuccessDismiss = () => {
    setSuccessVisible(false);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="로그아웃" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <LogoutImage width={170} height={112} />
        <Text style={styles.title}>로그아웃을 하시겠습니까?</Text>
        <Text style={styles.description}>로그아웃 후 다시 로그인해야 서비스를 이용할 수 있어요.</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      <SuccessView
        visible={isSuccessVisible}
        title="로그아웃이 완료되었습니다."
        onDismiss={handleSuccessDismiss}
      />
    </SafeAreaView>
  );
};

export default LogoutScreen;
