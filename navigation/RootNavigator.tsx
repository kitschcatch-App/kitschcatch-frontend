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
import TermsOfServiceScreen from '../screens/auth/TermsOfServiceScreen';
import PrivacyPolicyScreen from '../screens/auth/PrivacyPolicyScreen';
import PrivacyConsentScreen from '../screens/auth/PrivacyConsentScreen';
import LocationTermsScreen from '../screens/auth/LocationTermsScreen';
import MarketingConsentScreen from '../screens/auth/MarketingConsentScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import SignUpCompleteScreen from '../screens/auth/SignUpCompleteScreen';
import PaymentCompleteScreen from '../screens/payment/PaymentCompleteScreen';
import SafePaymentTermsScreen from '../screens/payment/SafePaymentTermsScreen';
import ApiTestScreen from '../screens/dev/ApiTestScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import SearchScreen from '../screens/home/SearchScreen';
import NotificationScreen from '../screens/home/NotificationScreen';
import MyPageScreen from '../screens/mypage/MyPageScreen';
import StoreMapScreen from '../screens/store/StoreMapScreen';
import StoreDetailScreen from '../screens/store/StoreDetailScreen';
import ReviewWriteScreen from '../screens/store/ReviewWriteScreen';
import ReviewPhotosScreen from '../screens/store/ReviewPhotosScreen';
import EditProfileScreen from '../screens/mypage/EditProfileScreen';
import FollowScreen from '../screens/mypage/FollowScreen';
import WishlistScreen from '../screens/mypage/WishlistScreen';
import SalesHistoryScreen from '../screens/mypage/SalesHistoryScreen';
import PurchaseHistoryScreen from '../screens/mypage/PurchaseHistoryScreen';
import OrderDetailScreen from '../screens/mypage/OrderDetailScreen';
import PurchaseOrderDetailScreen from '../screens/mypage/PurchaseOrderDetailScreen';
import ReturnRequestScreen from '../screens/mypage/ReturnRequestScreen';
import OtherUserProfileScreen from '../screens/mypage/OtherUserProfileScreen';
import UserProductsScreen from '../screens/mypage/UserProductsScreen';
import BlockUserScreen from '../screens/mypage/BlockUserScreen';
import type { ReportTargetType } from '../api/apiClient';
import ReportUserScreen from '../screens/mypage/ReportUserScreen';
import ReportDetailScreen from '../screens/mypage/ReportDetailScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import LogoutScreen from '../screens/settings/LogoutScreen';
import WithdrawScreen from '../screens/settings/WithdrawScreen';
import AddressManagementScreen from '../screens/settings/AddressManagementScreen';
import BlockedUsersScreen from '../screens/settings/BlockedUsersScreen';
import InquiryHistoryScreen from '../screens/mypage/InquiryHistoryScreen';
import InquiryScreen from '../screens/mypage/InquiryScreen';
import CustomerCenterScreen from '../screens/mypage/CustomerCenterScreen';
import DepositPolicyScreen from '../screens/settings/DepositPolicyScreen';
import PaymentLimitPolicyScreen from '../screens/settings/PaymentLimitPolicyScreen';
import TradePolicyScreen from '../screens/settings/TradePolicyScreen';
import NotificationPolicyScreen from '../screens/settings/NotificationPolicyScreen';
import WithdrawalPolicyScreen from '../screens/settings/WithdrawalPolicyScreen';
import IpPolicyScreen from '../screens/settings/IpPolicyScreen';
import OperationPolicyScreen from '../screens/settings/OperationPolicyScreen';
import ProhibitedItemsPolicyScreen from '../screens/settings/ProhibitedItemsPolicyScreen';
import TermsAndPoliciesScreen from '../screens/settings/TermsAndPoliciesScreen';
import NoticeScreen from '../screens/mypage/NoticeScreen';
import NotificationSettingsScreen from '../screens/settings/NotificationSettingsScreen';
import AddressRegistrationScreen from '../screens/settings/AddressRegistrationScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  TermsAgreement: undefined;
  TermsOfService: undefined;
  SafePaymentTerms: undefined;
  PrivacyPolicy: undefined;
  PrivacyConsent: undefined;
  LocationTerms: undefined;
  MarketingConsent: undefined;
  SignUp: undefined;
  SignUpComplete: {
    nickname: string;
  };
  Home: undefined;
  StoreMap: undefined;
  StoreDetail: {
    storeId: string;
    storeName: string;
    latitude: number;
    longitude: number;
  };
  ReviewWrite: {
    storeId: string;
    // 내 리뷰 수정 시 전달
    review?: {
      id: number;
      version: number;
      rating: number;
      content: string;
      images: { id: number; imageUrl: string }[];
    };
  };
  ReviewPhotos: { storeId: string };
  Search: undefined;
  Notification: undefined;
  ProductList: { keyword?: string; category?: string } | undefined;
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
    /** 있으면 헤더의 더보기(차단·신고) 메뉴를 보여준다 */
    opponentId?: number;
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
  Notice: undefined;
  TermsAndPolicies: undefined;
  ProhibitedItemsPolicy: undefined;
  OperationPolicy: undefined;
  IpPolicy: undefined;
  WithdrawalPolicy: undefined;
  NotificationPolicy: undefined;
  TradePolicy: undefined;
  PaymentLimitPolicy: undefined;
  DepositPolicy: undefined;
  CustomerCenter: undefined;
  Inquiry: undefined;
  InquiryHistory: undefined;
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
    /** 지정하면 해당 사용자의 목록을 읽기 전용으로 보여준다 (없으면 내 목록) */
    userId?: number;
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
  ReturnRequest: { orderId: string; amount: number };
  OtherUserProfile: { userId: number };
  UserProducts: { userId: number; nickname: string };
  /** hasActiveTrade: 차단 대상과 진행 중인 거래가 있으면 거래 유지 안내 팝업을 띄운다 */
  BlockUser: { userId: number; hasActiveTrade?: boolean };
  ReportUser: { userId: number; target?: 'product' | 'chat'; targetId?: number; alsoBlock?: boolean };
  ReportDetail: {
    userId: number;
    reason: string;
    reasonCode: string;
    targetType: ReportTargetType;
    targetId: number;
    target?: 'product' | 'chat';
    alsoBlock?: boolean;
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
        <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'none' }} />
        <Stack.Screen name="TermsAgreement" component={TermsAgreementScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="PrivacyConsent" component={PrivacyConsentScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="LocationTerms" component={LocationTermsScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="MarketingConsent" component={MarketingConsentScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="SignUpComplete" component={SignUpCompleteScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="StoreMap" component={StoreMapScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="StoreDetail" component={StoreDetailScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="ReviewWrite" component={ReviewWriteScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="ReviewPhotos" component={ReviewPhotosScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Mypage" component={MyPageScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Logout" component={LogoutScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Withdraw" component={WithdrawScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="AddressManagement" component={AddressManagementScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Notice" component={NoticeScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="TermsAndPolicies" component={TermsAndPoliciesScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="ProhibitedItemsPolicy" component={ProhibitedItemsPolicyScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="OperationPolicy" component={OperationPolicyScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="IpPolicy" component={IpPolicyScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="WithdrawalPolicy" component={WithdrawalPolicyScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="NotificationPolicy" component={NotificationPolicyScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="TradePolicy" component={TradePolicyScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="PaymentLimitPolicy" component={PaymentLimitPolicyScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="DepositPolicy" component={DepositPolicyScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="CustomerCenter" component={CustomerCenterScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Inquiry" component={InquiryScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="InquiryHistory" component={InquiryHistoryScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="AddressRegistration" component={AddressRegistrationScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Follow" component={FollowScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Wishlist" component={WishlistScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="SalesHistory" component={SalesHistoryScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="PurchaseOrderDetail" component={PurchaseOrderDetailScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="ReturnRequest" component={ReturnRequestScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Search"component={SearchScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Notification" component={NotificationScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="ProductList" component={ProductListScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="ChatList" component={ChatListScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="ProductRegistration" component={ProductRegistrationScreen} />
        <Stack.Screen name="ProductEdit" component={ProductEditScreen} />
        <Stack.Screen name="PaymentComplete" component={PaymentCompleteScreen} />
        <Stack.Screen name="SafePaymentTerms" component={SafePaymentTermsScreen} />
        <Stack.Screen name="OtherUserProfile" component={OtherUserProfileScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="UserProducts" component={UserProductsScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="BlockUser" component={BlockUserScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="ReportUser" component={ReportUserScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="ReportDetail" component={ReportDetailScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="ApiTest" component={ApiTestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </MockModeProvider>
  );
};

export default RootNavigator;