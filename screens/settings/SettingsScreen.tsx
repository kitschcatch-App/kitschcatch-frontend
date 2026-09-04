import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './SettingsScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';
import NextIcon from '../../assets/next.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const ACCOUNT_MENUS = [
  { id: 'editInfo', title: '내 정보 관리', titleStyle: styles.menuTitleBlack },
  { id: 'logout', title: '로그아웃', titleStyle: styles.menuTitleGray },
  { id: 'withdraw', title: '회원탈퇴', titleStyle: styles.menuTitleError },
];

const MANAGE_MENUS = [
  { id: 'address', title: '배송지 관리', titleStyle: styles.menuTitleBlack },
  { id: 'blockedUsers', title: '차단 사용자 관리', titleStyle: styles.menuTitleBlack },
];

const NOTIFICATION_MENUS = [
  { id: 'notificationSettings', title: '알림설정', titleStyle: styles.menuTitleBlack },
];

const SUPPORT_MENUS = [
  { id: 'notice', title: '공지사항', titleStyle: styles.menuTitleBlack },
  { id: 'customerCenter', title: '고객센터', titleStyle: styles.menuTitleBlack },
  { id: 'termsAndPolicies', title: '약관 및 정책', titleStyle: styles.menuTitleBlack },
];

const APP_INFO_MENUS = [
  { id: 'version', title: '버전정보', titleStyle: styles.menuTitleBlack },
];

const SettingsScreen = ({ navigation }: Props) => {
  const handleManageMenuPress = (id: string) => {
    if (id === 'address') {
      navigation.navigate('AddressManagement');
    } else if (id === 'blockedUsers') {
      navigation.navigate('BlockedUsers');
    }
  };

  const handleNotificationMenuPress = (id: string) => {
    if (id === 'notificationSettings') {
      navigation.navigate('NotificationSettings');
    }
  };

  const handleAccountMenuPress = (id: string) => {
    if (id === 'logout') {
      navigation.navigate('Logout');
    } else if (id === 'withdraw') {
      navigation.navigate('Withdraw');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="설정" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 계정 컨테이너 */}
        <View style={styles.accountContainer}>
          <Text style={styles.accountLabel}>계정</Text>

          <View style={styles.menuList}>
            {ACCOUNT_MENUS.map((menu) => (
              <TouchableOpacity
                key={menu.id}
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => handleAccountMenuPress(menu.id)}
              >
                <Text style={[styles.menuTitle, menu.titleStyle]}>{menu.title}</Text>
                <NextIcon width={7} height={20} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* 관리 컨테이너 */}
        <View style={styles.manageContainer}>
          <Text style={styles.accountLabel}>관리</Text>

          <View style={styles.menuList}>
            {MANAGE_MENUS.map((menu) => (
              <TouchableOpacity
                key={menu.id}
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => handleManageMenuPress(menu.id)}
              >
                <Text style={[styles.menuTitle, menu.titleStyle]}>{menu.title}</Text>
                <NextIcon width={7} height={20} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* 알림 컨테이너 */}
        <View style={styles.notificationContainer}>
          <Text style={styles.accountLabel}>알림</Text>

          <View style={styles.menuList}>
            {NOTIFICATION_MENUS.map((menu) => (
              <TouchableOpacity
                key={menu.id}
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => handleNotificationMenuPress(menu.id)}
              >
                <Text style={[styles.menuTitle, menu.titleStyle]}>{menu.title}</Text>
                <NextIcon width={7} height={20} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* 지원 컨테이너 */}
        <View style={styles.supportContainer}>
          <Text style={styles.accountLabel}>지원</Text>

          <View style={styles.menuList}>
            {SUPPORT_MENUS.map((menu) => (
              <TouchableOpacity key={menu.id} style={styles.menuItem} activeOpacity={0.7}>
                <Text style={[styles.menuTitle, menu.titleStyle]}>{menu.title}</Text>
                <NextIcon width={7} height={20} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* 앱 정보 컨테이너 */}
        <View style={styles.appInfoContainer}>
          <Text style={styles.accountLabel}>앱 정보</Text>

          <View style={styles.menuList}>
            {APP_INFO_MENUS.map((menu) => (
              <TouchableOpacity key={menu.id} style={styles.menuItem} activeOpacity={0.7}>
                <Text style={[styles.menuTitle, menu.titleStyle]}>{menu.title}</Text>
                <NextIcon width={7} height={20} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
