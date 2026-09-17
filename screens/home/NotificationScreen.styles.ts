/**
 * 스타일: 알림 화면 스타일 (NotificationScreen.styles)
 * 역할: NotificationScreen 컴포넌트의 UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

// 알림 type 텍스트 칼럼 너비: title/body/time의 x축을 이 값에 맞춰 정렬한다
const TYPE_COLUMN_WIDTH = 32;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  settingButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemUnread: {
    backgroundColor: colors.sub01,
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    width: TYPE_COLUMN_WIDTH,
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.sub07,
  },
  titleText: {
    flex: 1,
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.black,
  },
  bodyText: {
    marginTop: 4,
    marginLeft: TYPE_COLUMN_WIDTH,
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  timeText: {
    marginTop: 12,
    marginLeft: TYPE_COLUMN_WIDTH,
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray06,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.gray03,
  },
});
