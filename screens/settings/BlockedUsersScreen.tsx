/**
 * 화면: 차단 사용자 관리 (BlockedUsersScreen)
 * 역할: 내가 차단한 사용자 목록을 보여주고, 각 사용자의 차단을 해제할 수 있는 화면입니다.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './BlockedUsersScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';
import Toast from '../../components/Toast';

type Props = NativeStackScreenProps<RootStackParamList, 'BlockedUsers'>;

interface BlockedUser {
  id: string;
  nickname: string;
  productCount: number;
}

const INITIAL_BLOCKED_USERS: BlockedUser[] = [
  { id: '1', nickname: '떠오르는별', productCount: 12 },
  { id: '2', nickname: '조용한바다', productCount: 5 },
  { id: '3', nickname: '초코라떼', productCount: 8 },
];

const BlockedUsersScreen = ({ navigation }: Props) => {
  const [blockedUsers, setBlockedUsers] = useState(INITIAL_BLOCKED_USERS);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [unblockTargetId, setUnblockTargetId] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  const handleUnblock = (userId: string) => {
    // TODO: 차단 해제 API 연동
    setBlockedUsers((prev) => prev.filter((user) => user.id !== userId));
    setOpenMenuId(null);
    setUnblockTargetId(null);
    setToastVisible(true);
  };

  if (unblockTargetId !== null) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenHeader title="차단해제" onBack={() => setUnblockTargetId(null)} />

        <View style={styles.confirmContent}>
          <Text style={styles.confirmTitle}>이 사용자의 차단을 해제할까요?</Text>
          <Text style={styles.confirmDescription}>
            차단을 해제하면 해당 사용자와 다시 채팅하고 상품을 확인할 수 있습니다.
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.unblockConfirmButton}
            activeOpacity={0.8}
            onPress={() => handleUnblock(unblockTargetId)}
          >
            <Text style={styles.unblockConfirmButtonText}>차단해제</Text>
          </TouchableOpacity>
        </View>

        <Toast
          visible={toastVisible}
          message="사용자의 차단을 해제했습니다."
          position="center"
          onDismiss={() => setToastVisible(false)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="차단 사용자 관리" onBack={() => navigation.goBack()} />

      <FlatList
        style={styles.listContainer}
        contentContainerStyle={styles.listContainerInner}
        data={blockedUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View style={styles.userImage} />

            <View style={styles.userInfo}>
              <Text style={styles.userNickname}>{item.nickname}</Text>
              <Text style={styles.userProductCount}>판매물품 {item.productCount}개</Text>
            </View>

            <View style={styles.menuWrapper}>
              <TouchableOpacity
                style={styles.menuButton}
                activeOpacity={0.7}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                onPress={() => setOpenMenuId((prev) => (prev === item.id ? null : item.id))}
              >
                <View style={styles.menuDot} />
                <View style={[styles.menuDot, styles.menuDotSpacing]} />
                <View style={[styles.menuDot, styles.menuDotSpacing]} />
              </TouchableOpacity>

              {openMenuId === item.id && (
                <TouchableOpacity
                  style={styles.unblockButton}
                  activeOpacity={0.7}
                  onPress={() => {
                    setOpenMenuId(null);
                    setUnblockTargetId(item.id);
                  }}
                >
                  <Text style={styles.unblockButtonText} numberOfLines={1}>
                    차단 해제
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      <Toast
        visible={toastVisible}
        message="사용자의 차단을 해제했습니다."
        position="center"
        onDismiss={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

export default BlockedUsersScreen;
