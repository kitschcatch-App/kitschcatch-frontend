/**
 * 화면: 알림 화면 (NotificationScreen)
 * 역할: 채팅/구매/관심/판매 관련 알림 목록을 최신순으로 보여주는 화면입니다.
 */
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import ScreenHeader from '../../components/ScreenHeader';
import SettingIcon from '../../assets/setting.svg';
import { formatTime } from '../../utils/formatTime';
import { getNotificationTypeLabel } from '../../utils/notificationType';
import { styles } from './NotificationScreen.styles';
import { notificationAPI } from '../../api/apiClient';
import { getMockNotifications, markMockNotificationRead, mockDelay } from '../../api/mockData';
import { useMockMode } from '../../contexts/MockModeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Notification'>;

type NotificationItem = {
  id: number;
  type: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  productImageUrl?: string;
};

const PAGE_SIZE = 20;

const NotificationScreen = ({ navigation }: Props) => {
  const { isMockMode } = useMockMode();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchPage = useCallback(
    async (pageNum: number) => {
      if (isMockMode) {
        await mockDelay(300);
        return getMockNotifications({ unreadOnly: false, page: pageNum, size: PAGE_SIZE }).data.data;
      }
      const res = await notificationAPI.getNotifications({ unreadOnly: false, page: pageNum, size: PAGE_SIZE });
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
          setNotifications(data.content);
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

  const handleLoadMore = async () => {
    if (isLoadingMore || isLoading || page + 1 >= totalPages) return;

    try {
      setIsLoadingMore(true);
      const data = await fetchPage(page + 1);
      setNotifications((prev) => [...prev, ...data.content]);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (e) {
      console.error('알림 추가 조회 실패:', e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handlePressItem = async (id: number) => {
    const target = notifications.find((item) => item.id === id);
    if (!target || target.read) return;

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
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoadingMore ? <ActivityIndicator style={styles.loadMoreIndicator} /> : null}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.item, !item.read && styles.itemUnread]}
              activeOpacity={0.7}
              onPress={() => handlePressItem(item.id)}
            >
              <View style={styles.itemContent}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.typeText}>{getNotificationTypeLabel(item.type)}</Text>
                  <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
                    {item.title}
                  </Text>
                </View>
                <Text style={styles.bodyText} numberOfLines={2} ellipsizeMode="tail">
                  {item.body}
                </Text>
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
