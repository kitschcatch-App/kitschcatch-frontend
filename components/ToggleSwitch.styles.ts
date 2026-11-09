/**
 * 스타일: 토글 스위치 스타일 (ToggleSwitch.styles)
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

export const styles = StyleSheet.create({
  track: {
    width: 55,
    height: 28,
    borderRadius: 22,
    backgroundColor: colors.gray03,
    justifyContent: 'center',
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
  },
});
