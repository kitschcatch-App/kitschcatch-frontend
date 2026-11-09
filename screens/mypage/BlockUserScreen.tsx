/**
 * 화면: 차단하기 (BlockUserScreen)
 * 역할: 다른 사용자 프로필의 더보기 메뉴에서 차단하기를 눌렀을 때, 차단 안내와 적용사항을 보여줍니다.
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './BlockUserScreen.styles';
import { userAPI } from '../../api/apiClient';
import ScreenHeader from '../../components/ScreenHeader';
import Toast from '../../components/Toast';
import NoticePopup from '../../components/NoticePopup';

type Props = NativeStackScreenProps<RootStackParamList, 'BlockUser'>;

const EFFECTS = [
  '상대방이 새 채팅을 보낼 수 없습니다.',
  '상대방의 상품과 활동이 추천 및 검색에서 숨김 처리될 수 있습니다.',
  '차단한 사용자에게 차단 사실을 별도로 알리지 않습니다.',
  '진행 중인 거래, 배송, 환불 및 분쟁 처리는 계속됩니다.',
  '거래에 필요한 시스템 알림과 고객센터 안내는 차단되지 않습니다.',
];

const TRADE_NOTICE =
  '사용자를 차단했습니다.\n\n' +
  '차단한 사용자와 진행 중인 거래가 있습니다. 사용자를 차단해도 배송, 구매 확정, 환불 및 분쟁 처리는 계속됩니다.\n\n' +
  '거래 관련 연락은 주문 상세 화면과 고객센터를 이용해 주세요.';

const BlockUserScreen = ({ navigation, route }: Props) => {
  const hasActiveTrade = !!route.params.hasActiveTrade;
  const [toastVisible, setToastVisible] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(false);

  const [isBlocking, setIsBlocking] = useState(false);

  const handleBlock = async () => {
    if (isBlocking) return;
    setIsBlocking(true);
    try {
      await userAPI.blockUser(route.params.userId);
      if (hasActiveTrade) setNoticeVisible(true);
      else setToastVisible(true);
    } catch (e) {
      console.error('사용자 차단 실패:', e);
      Alert.alert('차단하기', '차단하지 못했어요. 다시 시도해주세요.');
    } finally {
      setIsBlocking(false);
    }
  };

  return (
  <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
    <ScreenHeader title="차단하기" onBack={() => navigation.goBack()} />

    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.title}>이 사용자를 차단할까요?</Text>
        <Text style={styles.subtitle}>
          차단하면 서로의 새 채팅과 상호작용이 제한됩니다. 차단은 신고와 별개이며, 운영정책 위반이 있었다면 신고도 함께 진행해
          주세요.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>차단 시 적용사항</Text>
        <View style={styles.bulletList}>
          {EFFECTS.map(text => (
            <View key={text} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{text}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>

    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={handleBlock}>
        <Text style={styles.buttonText}>차단하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={() => navigation.push('ReportUser', { userId: route.params.userId, alsoBlock: true })}>
        <Text style={styles.buttonText}>신고하고 차단하기</Text>
      </TouchableOpacity>
    </View>

    <Toast
      visible={toastVisible}
      message="사용자를 차단했습니다."
      position="center"
      onDismiss={() => setToastVisible(false)}
    />

    <NoticePopup visible={noticeVisible} message={TRADE_NOTICE} onConfirm={() => setNoticeVisible(false)} />
  </SafeAreaView>
  );
};

export default BlockUserScreen;
