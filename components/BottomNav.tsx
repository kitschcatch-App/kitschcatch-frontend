/**
 * 컴포넌트: 하단 네비게이션 바 (BottomNav)
 * 역할: 앱의 주요 화면(홈, 매장정보, 채팅목록, 회원정보)으로 이동할 수 있는 공통 네비게이션 바를 제공합니다.
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useNavigationState, NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavHomeIcon from '../assets/nav_home.svg';
import NavHomeOnIcon from '../assets/nav_home_on.svg';
import NavMapIcon from '../assets/nav_map.svg';
import NavMapOnIcon from '../assets/nav_map_on.svg';
import NavChatIcon from '../assets/nav_chat.svg';
import NavChatOnIcon from '../assets/nav_chat_on.svg';
import NavProfileIcon from '../assets/nav_profile.svg';
import NavProfileOnIcon from '../assets/nav_profile_on.svg';
import { RootStackParamList } from '../navigation/RootNavigator';
import { styles } from './BottomNav.styles';

type TabKey = 'home' | 'map' | 'chat' | 'profile';

const ROUTE_TO_TAB: Partial<Record<keyof RootStackParamList, TabKey>> = {
  Home: 'home',
  ProductList: 'home',
  ProductDetail: 'home',
  StoreMap: 'map',
  ChatList: 'chat',
  Chat: 'chat',
  Mypage: 'profile',
};

const BottomNav = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const currentRouteName = useNavigationState(
    (state) => state?.routes[state.index]?.name as keyof RootStackParamList | undefined,
  );
  const routeTab = currentRouteName ? ROUTE_TO_TAB[currentRouteName] : undefined;
  const activeTab = routeTab ?? 'home';

  return (
    <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        {activeTab === 'home' ? <NavHomeOnIcon width={18} height={18} /> : <NavHomeIcon width={18} height={18} />}
        <Text style={styles.navText}>홈</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StoreMap')}>
        {activeTab === 'map' ? (
          <NavMapOnIcon width={23} height={23} style={{ marginTop: 2 }} />
        ) : (
          <NavMapIcon width={23} height={23} style={{ marginTop: 2 }} />
        )}
        <Text style={styles.navText}>매장정보</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ChatList')}>
        {activeTab === 'chat' ? <NavChatOnIcon width={17} height={17} /> : <NavChatIcon width={17} height={17} />}
        <Text style={styles.navText}>채팅목록</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Mypage')}>
        {activeTab === 'profile' ? (
          <NavProfileOnIcon width={17} height={17} />
        ) : (
          <NavProfileIcon width={17} height={17} />
        )}
        <Text style={styles.navText}>회원정보</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNav;