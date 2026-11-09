/**
 * 화면: 공지사항 (NoticeScreen)
 * 역할: 마이페이지의 '공지사항'을 눌렀을 때 진입하며, 등록된 공지사항 목록을 보여주는 화면입니다.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import ScreenHeader from '../../components/ScreenHeader';
import { styles } from './NoticeScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Notice'>;

// ponytail: 공지사항 API 미정이라 목록 없이 빈 상태만 노출. API 붙으면 목록 렌더링 추가.
const NoticeScreen = ({ navigation }: Props) => (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <ScreenHeader title="공지사항" onBack={() => navigation.goBack()} />
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>등록된 공지사항이 없습니다.</Text>
    </View>
  </SafeAreaView>
);

export default NoticeScreen;
