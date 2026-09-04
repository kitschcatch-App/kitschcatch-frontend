/**
 * 네비게이션: 최상위 라우터 (RootNavigator)
 * 역할: 앱 내의 화면 이동 경로(Stack Navigation)를 설정하고 컴포넌트 간의 네비게이션을 관리하는 파일입니다.
 */
import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MockModeProvider } from '../contexts/MockModeContext';
import HomeScreen from '../screens/home/HomeScreen';
import ProductListScreen from '../screens/product/ProductListScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import PaymentScreen from '../screens/payment/PaymentScreen';
import ProductRegistrationScreen from '../screens/product/ProductRegistrationScreen';
import ProductEditScreen from '../screens/product/ProductEditScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import TermsAgreementScreen from '../screens/auth/TermsAgreementScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import SignUpCompleteScreen from '../screens/auth/SignUpCompleteScreen';
import PaymentCompleteScreen from '../screens/payment/PaymentCompleteScreen';
import ApiTestScreen from '../screens/dev/ApiTestScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import SearchScreen from '../screens/home/SearchScreen';
import MyPageScreen from '../screens/mypage/MyPageScreen';
import EditProfileScreen from '../screens/mypage/EditProfileScreen';
import FollowScreen from '../screens/mypage/FollowScreen';
import WishlistScreen from '../screens/mypage/WishlistScreen';
import SalesHistoryScreen from '../screens/mypage/SalesHistoryScreen';
import PurchaseHistoryScreen from '../screens/mypage/PurchaseHistoryScreen';
import OrderDetailScreen from '../screens/mypage/OrderDetailScreen';
import PurchaseOrderDetailScreen from '../screens/mypage/PurchaseOrderDetailScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import LogoutScreen from '../screens/settings/LogoutScreen';
import WithdrawScreen from '../screens/settings/WithdrawScreen';
import AddressManagementScreen from '../screens/settings/AddressManagementScreen';
import BlockedUsersScreen from '../screens/settings/BlockedUsersScreen';
import NotificationSettingsScreen from '../screens/settings/NotificationSettingsScreen';
import AddressRegistrationScreen from '../screens/settings/AddressRegistrationScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  TermsAgreement: undefined;
  SignUp: undefined;
  SignUpComplete: {
    nickname: string;
  };
  Home: undefined;
  Search: undefined;
  ProductList: undefined;
  ProductRegistration: undefined;
  ProductDetail: {
    productId: string;
    productName: string;
    productPrice: number;
    productImageUrl: string;
  };
  ProductEdit: {
    postId: string;
    title: string;
    description: string;
    price: number;
    imageURL: string;
    imageUrls: string[];
    imageKeys: string[];
    productCategory: string;
    productCondition: string;
    productStatus: string;
    sellerId: string;
  };
  ChatList: undefined;
  Chat: {
    chatRoomId: number;
    opponentNickname: string;
  };
  Payment: {
    productId: string;
    productName: string;
    productPrice: number;
    productImageUrl: string;
  };
  PaymentComplete: {
    productName: string;
    productPrice: number;
    totalPrice: number;
    productImageUrl: string;
    pgOrderId: string;
    paymentMethod?: string;
  };
  Mypage: undefined;
  Settings: undefined;
  Logout: undefined;
  Withdraw: undefined;
  AddressManagement: undefined;
  BlockedUsers: undefined;
  NotificationSettings: undefined;
  AddressRegistration:
    | {
        address: {
          id: string;
          name: string;
          phone: string;
          zipCode: string;
          address: string;
          detailAddress: string;
          isDefault?: boolean;
        };
      }
    | undefined;
  EditProfile: undefined;
  Follow: {
    initialTab?: 'follower' | 'following';
  } | undefined;
  Wishlist: undefined;
  SalesHistory: undefined;
  PurchaseHistory: undefined;
  OrderDetail: {
    orderId: string;
    orderNumber: string;
    productTitle: string;
    productPrice: number;
    productImage: ImageSourcePropType;
  };
  PurchaseOrderDetail: {
    orderId: string;
    orderNumber: string;
    productTitle: string;
    productPrice: number;
    productImage: ImageSourcePropType;
  };
  ApiTest: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <MockModeProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="TermsAgreement" component={TermsAgreementScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="SignUpComplete" component={SignUpCompleteScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Mypage" component={MyPageScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Logout" component={LogoutScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Withdraw" component={WithdrawScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="AddressManagement" component={AddressManagementScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="AddressRegistration" component={AddressRegistrationScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Follow" component={FollowScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Wishlist" component={WishlistScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="SalesHistory" component={SalesHistoryScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="PurchaseOrderDetail" component={PurchaseOrderDetailScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="ProductList" component={ProductListScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="ChatList" component={ChatListScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="ProductRegistration" component={ProductRegistrationScreen} />
        <Stack.Screen name="ProductEdit" component={ProductEditScreen} />
        <Stack.Screen name="PaymentComplete" component={PaymentCompleteScreen} />
        <Stack.Screen name="ApiTest" component={ApiTestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </MockModeProvider>
  );
};

export default RootNavigator;