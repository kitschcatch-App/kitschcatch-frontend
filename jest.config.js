module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // ESM으로 배포되는 패키지들을 babel 트랜스폼 대상에 포함시킨다
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-native-seoul|@react-navigation|react-native-config|react-native-safe-area-context|react-native-screens|react-native-svg)/)',
  ],
  // metro 전용 svg 트랜스포머를 대체 (모든 *.svg → 문자열 컴포넌트)
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
  },
};
