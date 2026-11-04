/**
 * 화면: 고객센터 (CustomerCenterScreen)
 * 역할: 마이페이지의 '고객센터'를 눌렀을 때 진입하며, 하단의 1:1 문의하기·문의내역 버튼을 제공하는 화면입니다.
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import ScreenHeader from '../../components/ScreenHeader';
import { styles } from './CustomerCenterScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerCenter'>;

const CustomerCenterScreen = ({ navigation }: Props) => (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <ScreenHeader title="고객센터" onBack={() => navigation.goBack()} />
    <View style={styles.content}>
      <Text style={styles.faqTitle}>자주 묻는 질문</Text>
    </View>
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Inquiry')}
      >
        <Text style={styles.buttonText}>1:1 문의하기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('InquiryHistory')}
      >
        <Text style={styles.buttonText}>문의내역</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

export default CustomerCenterScreen;
