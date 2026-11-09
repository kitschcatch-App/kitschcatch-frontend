/**
 * 화면: 알림설정 (NotificationSettingsScreen)
 * 역할: 전체/거래/서비스 알림 수신 여부를 항목별로 켜고 끌 수 있는 화면입니다.
 */
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './NotificationSettingsScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';
import ToggleSwitch from '../../components/ToggleSwitch';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationSettings'>;

interface NotificationItem {
  id: string;
  title: string;
  subtitle?: string;
}

const TRADE_NOTIFICATIONS: NotificationItem[] = [
  { id: 'purchase', title: '구매알림', subtitle: '결제 완료, 배송 시작 / 배송 완료, 주문 취소·환불' },
  { id: 'sale', title: '판매알림', subtitle: '신규 주문, 구매자 취소 요청, 발송기한 임박, 배송 완료' },
];

const SERVICE_NOTIFICATIONS: NotificationItem[] = [
  { id: 'chat', title: '채팅알림', subtitle: '새로운 메시지, 멘션, 안 읽은 메세지, 답장' },
  { id: 'wishlist', title: '관심상품 알림', subtitle: '관심 상품 가격 변경 / 판매 상태 변경' },
];

const NotificationSettingsScreen = ({ navigation }: Props) => {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    all: true,
    purchase: true,
    sale: true,
    chat: true,
    wishlist: true,
    notice: true,
  });

  const handleToggle = (id: string, value: boolean) => {
    setToggles((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="알림설정" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 전체 알림 컨테이너 */}
        <View style={styles.sectionContainer}>
          <View style={styles.simpleRow}>
            <Text style={styles.itemTitle}>전체알림</Text>
            <ToggleSwitch value={toggles.all} onValueChange={(value) => handleToggle('all', value)} />
          </View>
        </View>

        {/* 거래 알림 컨테이너 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>거래 알림</Text>

          <View style={styles.itemList}>
            {TRADE_NOTIFICATIONS.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemTextWrapper}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.subtitle && <Text style={styles.itemSubtitle}>{item.subtitle}</Text>}
                </View>
                <ToggleSwitch value={toggles[item.id]} onValueChange={(value) => handleToggle(item.id, value)} />
              </View>
            ))}
          </View>
        </View>


        {/* 서비스 알림 컨테이너 */}
        <View style={[styles.sectionContainer, styles.sectionContainerNoBottomMargin]}>
          <Text style={styles.sectionLabel}>서비스 알림</Text>

          <View style={styles.itemList}>
            {SERVICE_NOTIFICATIONS.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemTextWrapper}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.subtitle && <Text style={styles.itemSubtitle}>{item.subtitle}</Text>}
                </View>
                <ToggleSwitch value={toggles[item.id]} onValueChange={(value) => handleToggle(item.id, value)} />
              </View>
            ))}
          </View>
        </View>

        {/* 공지사항 및 이벤트 알림 컨테이너 */}
        <View style={styles.sectionContainer}>
          <View style={styles.noticeRow}>
            <Text style={styles.itemTitle}>공지사항 및 이벤트 알림</Text>
            <ToggleSwitch value={toggles.notice} onValueChange={(value) => handleToggle('notice', value)} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationSettingsScreen;
