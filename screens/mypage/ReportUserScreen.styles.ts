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
  dropdown: {
    paddingHorizontal: 16,
  },
  buttonContainer: {
    padding: 16,
  },
  nextButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.main05,
  },
  nextButtonDisabled: {
    backgroundColor: colors.gray02,
  },
  nextButtonText: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  nextButtonTextDisabled: {
    color: colors.gray06,
  },
});
