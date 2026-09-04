import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontFamily: typography.SB,
    fontSize: 14,
    color: colors.gray05,
  },
  itemList: {
    marginBottom: 16,
  },
  sectionContainerNoBottomMargin: {
    marginBottom: 0,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  simpleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  itemTextWrapper: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
  },
  itemSubtitle: {
    marginTop: 4,
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.gray07,
  },
});
