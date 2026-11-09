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
    paddingTop: 16,
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
    marginTop: 12,
    fontFamily: typography.M,
    fontSize: 12,
    lineHeight: 18,
    color: colors.black,
  },
  listRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  listMarker: {
    fontFamily: typography.R,
    fontSize: 12,
    lineHeight: 18,
    color: colors.black,
  },
  listMarkerNumber: {
    width: 22,
  },
  listMarkerBullet: {
    marginRight: 6,
  },
  listText: {
    flex: 1,
    fontFamily: typography.R,
    fontSize: 12,
    lineHeight: 18,
    color: colors.black,
  },
  note: {
    marginTop: 12,
    fontFamily: typography.R,
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
