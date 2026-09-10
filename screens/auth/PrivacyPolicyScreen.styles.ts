import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentInner: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 50,
  },
  pageTitle: {
    textAlign: 'left',
    fontFamily: typography.SB,
    fontSize: 20,
    color: colors.black,
  },
  registeredDate: {
    marginTop: 4,
    textAlign: 'left',
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray07,
  },
  sectionTitle: {
    marginTop: 16,
    fontFamily: typography.SB,
    fontSize: 12,
    color: colors.black,
  },
  paragraph: {
    marginTop: 8,
    fontFamily: typography.M,
    fontSize: 12,
    lineHeight: 22,
    color: colors.black,
  },
  listRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  listMarkerBullet: {
    marginRight: 6,
    fontFamily: typography.M,
    fontSize: 12,
    lineHeight: 22,
    color: colors.black,
  },
  listText: {
    flex: 1,
    fontFamily: typography.M,
    fontSize: 12,
    lineHeight: 22,
    color: colors.black,
  },
  tableScroll: {
    marginTop: 12,
  },
  table: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.black,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    width: 150,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.black,
  },
  tableHeaderCell: {
    backgroundColor: colors.gray01,
  },
  tableHeaderText: {
    fontFamily: typography.SB,
    fontSize: 12,
    lineHeight: 18,
    color: colors.black,
  },
  tableCellText: {
    fontFamily: typography.M,
    fontSize: 12,
    lineHeight: 18,
    color: colors.black,
  },
  errorText: {
    color: colors.error,
  },
  link: {
    color: colors.gray06,
    textDecorationLine: 'underline',
  },
});
