/**
 * 화면: 차단 사용자 관리 (BlockedUsersScreen)
 * 역할: 내가 차단한 사용자 목록을 보여주고, 각 사용자의 차단을 해제할 수 있는 화면입니다.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './BlockedUsersScreen.styles';
import { userAPI } from '../../api/apiClient';
import ScreenHeader from '../../components/ScreenHeader';
import Toast from '../../components/Toast';

type Props = NativeStackScreenProps<RootStackParamList, 'BlockedUsers'>;

interface BlockedUser {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
  blockedAt: string;
}

const BlockedUsersScreen = ({ navigation }: Props) => {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [unblockTargetId, setUnblockTargetId] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  // ponytail: 최근 100명(API 최대 size)까지만 조회. 더 필요하면 페이지네이션 추가.
  useEffect(() => {
    userAPI
      .getBlocks(0, 100)
      .then(res =>
        setBlockedUsers(
          res.data.data.content.map((u: any) => ({
            id: String(u.userId),
            nickname: u.nickname,
            profileImageUrl: u.profileImageUrl ?? null,
            blockedAt: u.blockedAt,
          })),
        ),
      )
      .catch(e => console.error('차단 목록 조회 실패:', e))
      .finally(() => setIsLoaded(true));
  }, []);

  const handleUnblock = async (userId: string) => {
    try {
      await userAPI.unblockUser(userId);
    } catch (e) {
      console.error('차단 해제 실패:', e);
      Alert.alert('차단해제', '차단을 해제하지 못했어요. 다시 시도해주세요.');
      return;
    }
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
        ListEmptyComponent={
          isLoaded ? <Text style={styles.emptyText}>차단한 사용자가 없습니다.</Text> : null
        }
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            {item.profileImageUrl ? (
              <Image source={{ uri: item.profileImageUrl }} style={styles.userImage} />
            ) : (
              <View style={styles.userImage} />
            )}

            <View style={styles.userInfo}>
              <Text style={styles.userNickname}>{item.nickname}</Text>
              <Text style={styles.userProductCount}>
                차단일 {item.blockedAt.slice(0, 10).replace(/-/g, '.')}
              </Text>
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
