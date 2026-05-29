/**
 * 네비게이션: 최상위 라우터 (RootNavigator)
 * 역할: 앱 내의 화면 이동 경로(Stack Navigation)를 설정하고 컴포넌트 간의 네비게이션을 관리하는 파일입니다.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MockModeProvider } from '../contexts/MockModeContext';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ProductRegistrationScreen from '../screens/ProductRegistrationScreen';
import ProductEditScreen from '../screens/ProductEditScreen';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import PaymentCompleteScreen from '../screens/PaymentCompleteScreen';
import ApiTestScreen from '../screens/ApiTestScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
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
    imageKeys: string[];
    productCategory: string;
    productCondition: string;
    productStatus: string;
    sellerId: string;
  };
  Chat: {
    sellerName: string;
    productName: string;
    productImageUrl: string;
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
        <Stack.Screen name="ProductList" component={ProductListScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ animation: 'fade' }} />
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