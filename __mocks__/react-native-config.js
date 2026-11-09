/**
 * react-native-config 수동 목: 실제 index.js가 ESM/네이티브 모듈이라
 * jest 트랜스폼 대상에서 제외되어 파싱 에러가 나므로, 테스트에서는 고정값을 사용한다.
 * (node_modules 인접 __mocks__ 는 jest가 자동으로 적용)
 */
const Config = {
  API_BASE_URL: 'https://test.example.com/api',
  KAKAO_APP_KEY: 'test-kakao-key',
  NAVER_CLIENT_ID: 'test-naver-id',
  NAVER_CLIENT_SECRET: 'test-naver-secret',
  NAVER_APP_NAME: 'kitschcatch',
  TOSS_CLIENT_KEY: 'test-toss-key',
};

module.exports = {
  __esModule: true,
  default: Config,
  Config,
};
