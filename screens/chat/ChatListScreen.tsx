/**
 * 화면: 채팅 목록 화면 (ChatListScreen)
 * 역할: 사용자가 참여 중인 채팅방 목록을 최근 메시지 순으로 보여주는 화면입니다.
 */
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRefreshControl } from '../../hooks/useRefreshControl';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import BottomNav from '../../components/BottomNav';
import BouncingView from '../../components/BouncingView';
import ConfirmView from '../../components/ConfirmView';
import SuccessView from '../../components/SuccessView';
import ChatIcon from '../../assets/chat.svg';
import { styles } from './ChatListScreen.styles';
import { chatAPI } from '../../api/apiClient';
import { MOCK_CHAT_ROOMS, mockDelay } from '../../api/mockData';
import { useMockMode } from '../../contexts/MockModeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatList'>;

type ChatRoom = {
  chatRoomId: number;
  opponentId: number;
  opponentNickname: string;
  lastMessageContent: string | null;
  lastMessageAt: string | null;
  unreadCount?: number;
};

const formatLastMessageTime = (isoString: string | null): string => {
  if (!isoString) return '';
  const withTz = isoString.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(isoString)
    ? isoString
    : `${isoString}Z`;
  const date = new Date(withTz);
  if (isNaN(date.getTime())) return '';
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  return `${diffDays}일 전`;
};

// ponytail: 채팅방 삭제 API가 없어 앱 실행 중에만 목록에서 숨긴다(재조회해도 유지). API가 생기면 호출로 교체.
const deletedRoomIds = new Set<number>();

// 빈 상태 아이콘: 마운트 시 한 번 위로 튀어 오름
const BouncingChatIcon = () => (
  <BouncingView style={styles.emptyImage}>
    <ChatIcon width={144} height={120} />
  </BouncingView>
);

const ChatListScreen = ({ navigation }: Props) => {
  const { isMockMode } = useMockMode();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      // 스피너는 첫 조회(초기값 true)에만. 재진입 시엔 기존 화면을 유지한 채 조용히 갱신
      if (isMockMode) {
        await mockDelay(300);
        setChatRooms(MOCK_CHAT_ROOMS.data.filter(r => !deletedRoomIds.has(r.chatRoomId)));
      } else {
        const res = await chatAPI.getChatRooms();
        // 서버가 { data: [...] } 래퍼를 사용하는 경우도 처리
        const rooms = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        setChatRooms(rooms.filter((r: ChatRoom) => !deletedRoomIds.has(r.chatRoomId)));
      }
    } catch (e) {
      console.error('채팅 목록 조회 실패:', e);
    } finally {
      setIsLoading(false);
    }
  }, [isMockMode]);

  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, [fetchRooms])
  );
  const refreshControl = useRefreshControl(fetchRooms);

  const renderItem = ({ item }: { item: ChatRoom }) => {
    const isUnread = (item.unreadCount ?? 0) > 0;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate('Chat', {
          chatRoomId: item.chatRoomId,
          opponentNickname: item.opponentNickname,
          opponentId: item.opponentId,
        })}
        onLongPress={() => setDeleteTargetId(item.chatRoomId)}
        activeOpacity={0.8}
      >
        <View style={styles.profileImage} />
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.sellerName}>{item.opponentNickname}</Text>
          </View>
          <View style={styles.messageRow}>
            <Text
              style={[styles.lastMessage, !isUnread && styles.lastMessageRead]}
              numberOfLines={1}
            >
              {item.lastMessageContent ?? ''}
            </Text>
            {item.lastMessageAt && (
              <Text style={[styles.timeText, !isUnread && styles.timeTextRead]}>
                · {formatLastMessageTime(item.lastMessageAt)}
              </Text>
            )}
            {isUnread && (
              <View style={[styles.unreadBadge, styles.badgeRightAligned]}>
                <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>채팅 목록</Text>
        {isMockMode && (
          <TouchableOpacity
            style={styles.mockToggleButton}
            onPress={() => setChatRooms((prev) => (prev.length === 0 ? MOCK_CHAT_ROOMS.data : []))}
            activeOpacity={0.8}
          >
            <Text style={styles.mockToggleButtonText}>
              {chatRooms.length === 0 ? '목록 채우기' : '빈 상태 보기'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : chatRooms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <BouncingChatIcon />
          <Text style={styles.emptyTitle}>아직 채팅이 없어요!</Text>
          <Text style={styles.emptySubtitle}>
            관심있는 상품을 둘러보고 판매자와 대화를 시작해보세요.
          </Text>
        </View>
      ) : (
        <FlatList
          data={chatRooms}
          keyExtractor={(item) => item.chatRoomId.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        />
      )}

      <ConfirmView
        visible={deleteTargetId !== null}
        title="채팅을 삭제하시겠습니까?"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId !== null) {
            deletedRoomIds.add(deleteTargetId);
            setChatRooms(prev => prev.filter(r => r.chatRoomId !== deleteTargetId));
          }
          setDeleteTargetId(null);
          setShowDeleteSuccess(true);
        }}
      />

      <SuccessView
        visible={showDeleteSuccess}
        title="채팅이 삭제되었습니다."
        onDismiss={() => setShowDeleteSuccess(false)}
      />

      <BottomNav />
    </SafeAreaView>
  );
};

export default ChatListScreen;
