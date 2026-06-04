/**
 * 화면: 채팅 목록 화면 (ChatListScreen)
 * 역할: 사용자가 참여 중인 채팅방 목록을 최근 메시지 순으로 보여주는 화면입니다.
 */
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import BottomNav from '../components/BottomNav';
import { styles } from './ChatListScreen.styles';
import { chatAPI } from '../api/apiClient';
import { MOCK_CHAT_ROOMS, mockDelay } from '../api/mockData';
import { useMockMode } from '../contexts/MockModeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatList'>;

type ChatRoom = {
  chatRoomId: number;
  opponentId: number;
  opponentNickname: string;
  lastMessageContent: string | null;
  lastMessageAt: string | null;
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

const ChatListScreen = ({ navigation }: Props) => {
  const { isMockMode } = useMockMode();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        try {
          setIsLoading(true);
          if (isMockMode) {
            await mockDelay(300);
            setChatRooms(MOCK_CHAT_ROOMS.data);
          } else {
            const res = await chatAPI.getChatRooms();
            // 서버가 { data: [...] } 래퍼를 사용하는 경우도 처리
            const rooms = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
            setChatRooms(rooms);
          }
        } catch (e) {
          console.error('채팅 목록 조회 실패:', e);
        } finally {
          setIsLoading(false);
        }
      };
      fetch();
    }, [isMockMode])
  );

  const renderItem = ({ item }: { item: ChatRoom }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', {
        chatRoomId: item.chatRoomId,
        opponentNickname: item.opponentNickname,
      })}
      activeOpacity={0.8}
    >
      <View style={styles.profileImage} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.sellerName}>{item.opponentNickname}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessageContent ?? ''}
          </Text>
          {item.lastMessageAt && (
            <Text style={styles.timeText}> · {formatLastMessageTime(item.lastMessageAt)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>채팅</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={chatRooms}
          keyExtractor={(item) => item.chatRoomId.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <BottomNav />
    </SafeAreaView>
  );
};

export default ChatListScreen;
