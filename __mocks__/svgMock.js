/**
 * SVG 목: metro의 react-native-svg-transformer는 jest에서 동작하지 않으므로
 * 모든 *.svg import를 단순 문자열 컴포넌트로 치환한다. (jest.config.js moduleNameMapper)
 */
module.exports = 'SvgMock';
module.exports.default = 'SvgMock';
module.exports.ReactComponent = 'SvgMock';
