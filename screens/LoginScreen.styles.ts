import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: undefined,
    aspectRatio: 1,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.gray05,
    marginBottom: 100,
  },
  kakaoButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#FEE500',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kakaoIcon: {
    position: 'absolute',
    left: 20, // 버튼 안쪽 맨 왼쪽에 고정
  },
  kakaoButtonText: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  devTestButton: {
    marginTop: 16,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  devTestButtonText: {
    fontSize: 12,
    fontFamily: typography.R,
    color: colors.gray05,
  },
});