/**
 * 화면: 알림 화면 (NotificationScreen)
 * 역할: 채팅/구매/관심/판매 관련 알림 목록을 최신순으로 보여주는 화면입니다.
 */
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import ScreenHeader from '../../components/ScreenHeader';
import SettingIcon from '../../assets/setting.svg';
import { formatTime } from '../../utils/formatTime';
import { getNotificationTypeLabel } from '../../utils/notificationType';
import { styles } from './NotificationScreen.styles';
import { chatAPI, notificationAPI, orderAPI } from '../../api/apiClient';
import { getMockNotifications, markMockNotificationRead, mockDelay, MOCK_CHAT_ROOMS } from '../../api/mockData';
import { getNotificationTarget } from '../../utils/notificationTarget';
import { secureStorage } from '../../utils/secureStorage';
import { useMockMode } from '../../contexts/MockModeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Notification'>;

type NotificationItem = {
  id: number;
  type: string;
  title: string;
  targetId?: string;
  body?: string; // 서버 스펙에는 없음. 내려오면 본문으로 표시
  createdAt: string;
  read: boolean;
  productImageUrl?: string | null; // 서버 스펙에는 없음. 내려오면 썸네일로 표시
};

// 서버 응답(readAt) → 화면용 항목(read)
const toItem = (raw: any): NotificationItem => ({ ...raw, read: !!raw.readAt });

const PAGE_SIZE = 20;

const NotificationScreen = ({ navigation }: Props) => {
  const { isMockMode } = useMockMode();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPage = useCallback(
    async (pageNum: number) => {
      if (isMockMode) {
        await mockDelay(300);
        return getMockNotifications({ page: pageNum, size: PAGE_SIZE }).data.data;
      }
      const res = await notificationAPI.getNotifications({ page: pageNum, size: PAGE_SIZE });
      return res.data.data;
    },
    [isMockMode],
  );

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          setIsLoading(true);
          const data = await fetchPage(0);
          setNotifications(data.notifications.map(toItem));
          setPage(data.page);
          setTotalPages(data.totalPages);
        } catch (e) {
          console.error('알림 목록 조회 실패:', e);
        } finally {
          setIsLoading(false);
        }
      };
      load();
    }, [fetchPage]),
  );

  // 아래로 당겨 새로고침: 첫 페이지부터 다시 조회
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchPage(0);
      setNotifications(data.notifications.map(toItem));
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (e) {
      console.error('알림 새로고침 실패:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || isLoading || page + 1 >= totalPages) return;

    try {
      setIsLoadingMore(true);
      const data = await fetchPage(page + 1);
      setNotifications((prev) => [...prev, ...data.notifications.map(toItem)]);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (e) {
      console.error('알림 추가 조회 실패:', e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 알림 대상 화면으로 이동. 모르는 type이거나 조회에 실패하면 알림 목록에 머문다.
  const navigateToTarget = async (item: NotificationItem) => {
    const dest = getNotificationTarget(item.type, item.targetId ?? '');
    if (!dest) return;

    try {
      if (dest.screen === 'Chat') {
        // 채팅방 상세 응답에 상대방 닉네임이 없어 목록에서 찾는다 (백엔드 추가 예정)
        const rooms = isMockMode ? MOCK_CHAT_ROOMS.data : (await chatAPI.getChatRooms()).data.data;
        const room = rooms.find((r: any) => r.chatRoomId === dest.chatRoomId);
        navigation.navigate('Chat', { chatRoomId: dest.chatRoomId, opponentNickname: room?.opponentNickname ?? '', opponentId: room?.opponentId });
        return;
      }

      if (isMockMode) return; // mock에는 주문 상세가 없음
      // 내가 판매자인지 구매자인지는 거래 상세로 판별
      const order = (await orderAPI.getOrder(dest.orderNumber)).data.data;
      const myId = await secureStorage.getItem('userId');
      const params = {
        orderId: order.orderId,
        orderNumber: order.orderId,
        productTitle: order.post.title,
        productPrice: order.amount,
        productImage: { uri: order.post.thumbnailUrl ?? '' },
      };
      navigation.navigate(String(order.seller.id) === myId ? 'OrderDetail' : 'PurchaseOrderDetail', params);
    } catch (e) {
      console.error('알림 이동 실패:', e);
    }
  };

  const handlePressItem = async (item: NotificationItem) => {
    navigateToTarget(item);
    const id = item.id;
    if (item.read) return;

    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );

    try {
      if (isMockMode) {
        await mockDelay(200);
        markMockNotificationRead(id);
      } else {
        await notificationAPI.readNotification(id);
      }
    } catch (e) {
      console.error('알림 읽음 처리 실패:', e);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: false } : item)),
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        title="알림"
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity
            style={styles.settingButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('BlockedUsers')}
          >
            <SettingIcon width={22} height={22} />
          </TouchableOpacity>
        }
      />

      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : (
        <FlatList
          style={styles.list}
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoadingMore ? <ActivityIndicator style={styles.loadMoreIndicator} /> : null}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.item, !item.read && styles.itemUnread]}
              activeOpacity={0.7}
              onPress={() => handlePressItem(item)}
            >
              <View style={styles.itemContent}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.typeText}>{getNotificationTypeLabel(item.type)}</Text>
                  <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
                    {item.title}
                  </Text>
                </View>
                {!!item.body && (
                  <Text style={styles.bodyText} numberOfLines={2} ellipsizeMode="tail">
                    {item.body}
                  </Text>
                )}
                <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
              </View>
              {item.productImageUrl && (
                <Image source={{ uri: item.productImageUrl }} style={styles.productImage} resizeMode="cover" />
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;
