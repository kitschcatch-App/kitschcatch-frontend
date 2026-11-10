// 화면 표시부터 주문 생성·토스 호출·결제 완료까지 동일한 서버 금액을 검증한다.
import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { Alert, Text, TouchableOpacity } from 'react-native';
const vm: {
  runInNewContext: (script: string, context: object) => unknown;
} = require('vm');
import PaymentScreen from '../screens/payment/PaymentScreen';
import { addressAPI, orderAPI, paymentAPI } from '../api/apiClient';

jest.mock('../contexts/MockModeContext', () => ({
  useMockMode: () => ({ isMockMode: false }),
}));
jest.mock('react-native-config', () => ({ TOSS_CLIENT_KEY: 'test_ck_local' }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: require('react-native').View,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('../components/CommonPopup', () => 'CommonPopup');
jest.mock('../components/AddressBottomSheet', () => ({
  __esModule: true,
  default: 'AddressBottomSheet',
  toSelectedAddress: (address: unknown) => address,
}));
jest.mock('../api/apiClient', () => ({
  addressAPI: { list: jest.fn() },
  orderAPI: {
    getQuote: jest.fn(),
    createOrder: jest.fn(),
    cancelOrder: jest.fn(),
  },
  paymentAPI: { confirmPayment: jest.fn(), getPayment: jest.fn() },
}));

const pricing = {
  currency: 'KRW',
  pricingPolicyVersion: 'V2_SELLER_500_BUYER_0',
  productAmount: 30000,
  shippingAmount: 3000,
  buyerFeeAmount: 0,
  totalAmount: 33000,
  sellerFeeAmount: 1500,
  sellerPayoutAmount: 31500,
};
const quote = {
  quoteId: 'QUOTE-test',
  pricing,
  expiresAt: '2026-11-10T12:00:00',
};
const response = (data: unknown) => ({ data: { data } });
const navigate = jest.fn();
let screen: Renderer.ReactTestRenderer;
const render = async () => {
  await act(async () => {
    screen = Renderer.create(
      <PaymentScreen
        navigation={{ navigate, goBack: jest.fn() } as any}
        route={
          {
            params: {
              productId: '7',
              productPrice: 29000,
              productName: '굿즈',
              productImageUrl: 'https://example.com/image',
            },
          } as any
        }
      />,
    );
  });
};
const press = async (label: string) => {
  const button = screen.root
    .findAllByType(TouchableOpacity)
    .find(node =>
      node.findAllByType(Text).some(text => text.props.children === label),
    );
  if (!button) throw new Error(`버튼 없음: ${label}`);
  await act(async () => {
    button.props.onPress();
  });
};
const ready = async () => {
  await render();
  await press('배송시 요청사항 선택');
  await press('요청사항 없음');
  await press('신용카드');
  await press('결제 진행 필수 동의');
};
const pay = async () => {
  await act(async () => {
    await screen.root.findByProps({ testID: 'checkout-pay' }).props.onPress();
  });
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  (addressAPI.list as jest.Mock).mockResolvedValue(
    response([
      { id: 4, name: '구매자', phone: '01012345678', address: '서울' },
    ]),
  );
  (orderAPI.getQuote as jest.Mock).mockResolvedValue(response(quote));
  (orderAPI.createOrder as jest.Mock).mockResolvedValue(
    response({
      orderId: 'ORD-test',
      paymentId: 'PAY-test',
      attemptId: 'ATT-test',
      pgOrderId: 'PG-test',
      pricing,
    }),
  );
  (orderAPI.cancelOrder as jest.Mock).mockResolvedValue(response({}));
  (paymentAPI.confirmPayment as jest.Mock).mockResolvedValue(
    response({ status: 'SUCCESS' }),
  );
});
afterEach(async () => {
  await act(async () => {
    screen?.unmount();
  });
  jest.useRealTimers();
  jest.restoreAllMocks();
});
jest.setTimeout(20000);

it('화면·주문 요청·토스 SDK·완료 화면이 모두 33,000원을 사용한다', async () => {
  await ready();
  expect(orderAPI.getQuote).toHaveBeenCalledWith(7, 4);
  expect(
    screen.root.findByProps({ testID: 'checkout-total' }).props.children,
  ).toBe('33,000원');
  await pay();
  expect(orderAPI.createOrder).toHaveBeenCalledWith({
    postId: 7,
    shippingAddressId: 4,
    quoteId: 'QUOTE-test',
    amount: 33000,
    paymentMethod: 'CARD',
  });
  const webview = screen.root.findByType('WebView' as any);
  const script = webview.props.source.html.match(
    /<script>([\s\S]*?)<\/script>/,
  )[1];
  const requestPayment = jest.fn().mockResolvedValue(undefined);
  vm.runInNewContext(script, {
    TossPayments: () => ({ requestPayment }),
    window: { ReactNativeWebView: { postMessage: jest.fn() } },
  });
  expect(requestPayment).toHaveBeenCalledWith(
    '카드',
    expect.objectContaining({ amount: 33000, orderId: 'PG-test' }),
  );
  await act(async () => {
    webview.props.onShouldStartLoadWithRequest({
      url: 'https://payment.kitschcatch.com/success?paymentKey=test-key',
    });
  });
  expect(paymentAPI.confirmPayment).toHaveBeenCalledWith('PAY-test', {
    paymentKey: 'test-key',
    attemptId: 'ATT-test',
  });
  expect(navigate).toHaveBeenCalledWith(
    'PaymentComplete',
    expect.objectContaining({ productPrice: 30000, totalPrice: 33000 }),
  );
});

it('견적이 만료되면 새 금액만 보여주고 동의 없이 결제하지 않는다', async () => {
  await ready();
  (orderAPI.createOrder as jest.Mock).mockRejectedValueOnce({
    response: { data: { error: { code: 'ORDER_095_001' } } },
  });
  await pay();
  expect(orderAPI.getQuote).toHaveBeenCalledTimes(2);
  expect(orderAPI.createOrder).toHaveBeenCalledTimes(1);
  expect(screen.root.findAllByType('WebView' as any)).toHaveLength(0);
});

it('주문 응답 금액이 견적과 다르면 주문을 취소하고 결제창을 열지 않는다', async () => {
  await ready();
  (orderAPI.createOrder as jest.Mock).mockResolvedValueOnce(
    response({
      orderId: 'ORD-test',
      paymentId: 'PAY-test',
      pricing: { ...pricing, totalAmount: 30000 },
    }),
  );
  await pay();
  expect(orderAPI.cancelOrder).toHaveBeenCalledWith(
    'ORD-test',
    '결제 금액 확인 실패',
  );
  expect(screen.root.findAllByType('WebView' as any)).toHaveLength(0);
});
