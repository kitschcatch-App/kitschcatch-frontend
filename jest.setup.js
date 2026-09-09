/**
 * jest 전역 셋업: jest에서 로드되지 않는 서드파티 네이티브 모듈을 목으로 대체한다.
 * (App.test 처럼 앱 전체 트리를 렌더하는 테스트가 네이티브 모듈 부재로 깨지는 것을 방지)
 */

jest.mock('@react-native-seoul/kakao-login', () => ({
  login: jest.fn(),
  loginWithNewScopes: jest.fn(),
  logout: jest.fn(),
  getProfile: jest.fn(),
}));

jest.mock('@react-native-seoul/naver-login', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    deleteToken: jest.fn(),
    getProfile: jest.fn(),
  },
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve(false)),
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
  ACCESSIBLE: {},
  ACCESS_CONTROL: {},
}));

jest.mock('react-native-webview', () => ({
  __esModule: true,
  default: 'WebView',
  WebView: 'WebView',
}));

jest.mock('@stomp/stompjs', () => ({
  Client: jest.fn(() => ({
    activate: jest.fn(),
    deactivate: jest.fn(),
    publish: jest.fn(),
    subscribe: jest.fn(),
  })),
}));

jest.mock('sockjs-client', () => jest.fn());
