import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const FULL_HEIGHT = 44;
export const COLLAPSED_HEIGHT = 44;
export const ICON_SIZE = 22;

export const styles = StyleSheet.create({
  // 오른쪽 끝에 고정된 래퍼. 버튼은 이 안에서 오른쪽 기준으로 줄어든다
  wrapper: {
    position: 'absolute',
    right: 16,
    height: COLLAPSED_HEIGHT,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    overflow: 'hidden',
    backgroundColor: colors.main05,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 2,
  },
  // 축소됐을 때 등록 버튼 위에 나타나는 맨 위로 버튼
  topButton: {
    position: 'absolute',
    right: 16,
    width: COLLAPSED_HEIGHT,
    height: COLLAPSED_HEIGHT,
    borderRadius: COLLAPSED_HEIGHT / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: colors.gray03,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 2,
  },
  topTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
});
