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
    paddingBottom: 50,
  },
  titleContainer: {
    padding: 16,
  },
  pageTitle: {
    fontFamily: typography.SB,
    fontSize: 20,
    color: colors.black,
  },
  registeredDate: {
    marginTop: 4,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray07,
  },
  // 제 N조 단위 컨테이너
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontFamily: typography.SB,
    fontSize: 12,
    color: colors.black,
  },
  // 본문 줄 사이 간격 8px
  sectionBody: {
    gap: 8,
  },
  lineRow: {
    flexDirection: 'row',
  },
  lineMarker: {
    fontFamily: typography.R,
    fontSize: 12,
    lineHeight: 18,
    color: colors.black,
  },
  markerNumber: {
    width: 22,
  },
  markerBullet: {
    marginRight: 6,
  },
  lineText: {
    flex: 1,
    fontFamily: typography.R,
    fontSize: 12,
    lineHeight: 18,
    color: colors.black,
  },
  link: {
    color: colors.gray06,
    textDecorationLine: 'underline',
  },
});
