/**
 * 화면: 채팅 목록 화면 (ChatListScreen)
 * 역할: 사용자가 참여 중인 채팅방 목록을 보여주는 화면입니다.
 */
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import BottomNav from '../components/BottomNav';
import { styles } from './ChatListScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatList'>;

// 하드코딩된 임시 목업 데이터
const mockChats = [
  {
    id: '1',
    sellerName: '졸린코끼리',
    productName: '미개봉 한정판 피규어',
    productImageUrl: 'https://via.placeholder.com/150',
    lastMessage: '안녕하세요. 구매 가능한지 여쭤보려합니다.',
    time: '45분전',
  },
  {
    id: '2',
    sellerName: '못자는 햄스터',
    productName: '공식 아크릴 스탠드',
    productImageUrl: 'https://via.placeholder.com/150',
    lastMessage: '택배비 포함 가격인가요?',
    time: '3시간전',
  }
];

const ChatListScreen = ({ navigation }: Props) => {
  // 각각의 채팅방 아이템 렌더링
  const renderItem = ({ item }: { item: typeof mockChats[0] }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', {
        sellerName: item.sellerName,
        productName: item.productName,
        productImageUrl: item.productImageUrl,
      })}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.productImageUrl }} style={styles.profileImage} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.sellerName}>{item.sellerName}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
          <Text style={styles.timeText}> · {item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>채팅</Text>
      </View>
      
      <FlatList
        data={mockChats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <BottomNav />
    </SafeAreaView>
  );
};

export default ChatListScreen;