/**
 * 컴포넌트: 하단 네비게이션 바 (BottomNav)
 * 역할: 앱의 주요 화면(홈, 상품검색, 채팅, 회원정보)으로 이동할 수 있는 공통 네비게이션 바를 제공합니다.
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavHomeIcon from '../assets/nav_home.svg';
import NavMapIcon from '../assets/nav_map.svg';
import NavSearchIcon from '../assets/nav_search.svg';
import NavChatIcon from '../assets/nav_chat.svg';
import NavProfileIcon from '../assets/nav_profile.svg';
import { RootStackParamList } from '../navigation/RootNavigator';
import { styles } from './BottomNav.styles';

const BottomNav = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <TouchableOpacity style={styles.navItem}>
        <NavMapIcon width={20} height={20} />
        <Text style={styles.navText}>매장지도</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <NavSearchIcon width={18} height={18} />
        <Text style={styles.navText}>상품검색</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ProductList')}>
        <NavHomeIcon width={20} height={20} />
        <Text style={styles.navText}>홈</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ChatList')}>
        <NavChatIcon width={20} height={20} />
        <Text style={styles.navText}>채팅목록</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <NavProfileIcon width={20} height={20} />
        <Text style={styles.navText}>회원정보</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNav;