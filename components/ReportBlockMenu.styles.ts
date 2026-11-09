import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  // 헤더 오른쪽 위 더보기(점 3개) 버튼의 왼쪽 아래에 뜨는 드롭다운
  menu: {
    position: 'absolute',
    top: 80,
    right: 26,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.white,
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  item: {
    paddingVertical: 4,
    alignItems: 'center',
  },
  text: {
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.black,
  },
  textDanger: {
    color: colors.error,
  },
});
