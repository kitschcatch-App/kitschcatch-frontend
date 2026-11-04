import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  section: {
    padding: 16,
  },
  title: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray07,
  },
  // 점(•) 목록: 줄바꿈 시 텍스트가 점 아래로 들어가지 않도록 점과 본문을 분리
  buttonContainer: {
    padding: 16,
    gap: 8,
  },
  button: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.gray01,
  },
  buttonText: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.error,
  },
  bulletList: {
    marginTop: 6,
  },
  bulletRow: {
    flexDirection: 'row',
  },
  bulletDot: {
    marginRight: 6,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray07,
  },
  bulletText: {
    flex: 1,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray07,
  },
});
