import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    marginBottom: 12,
  },
  profileSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  profileImageWrapper: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.gray02,
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.61,
    elevation: 2,
    backgroundColor: colors.white,
  },
  formSection: {
    paddingHorizontal: 16,
  },
  fieldGroup: {
    marginTop: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.black,
    marginBottom: 8,
  },
  requiredMark: {
    color: colors.sub07,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  inputContainer: {
    flex: 1,
  },
  disabledInputText: {
    color: colors.gray07,
  },
  idGuideText: {
    marginTop: 6,
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.gray07,
  },
  duplicateColumn: {
    alignItems: 'flex-end',
  },
  nicknameCounter: {
    marginTop: 6,
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.gray07,
  },
  nicknameCounterMax: {
    color: colors.error,
  },
  duplicateButton: {
    display: 'flex',
    paddingVertical: 14,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.main01,
    borderWidth: 1,
    borderColor: colors.main07
  },
  duplicateButtonDisabled: {
    opacity: 0.5,
  },
  duplicateButtonText: {
    fontSize: 16,
    fontFamily: typography.M,
    color: colors.sub07
  },
  duplicateButtonDone: {
    backgroundColor: '#8585854D',
    borderColor: colors.gray06,
  },
  duplicateButtonTextDone: {
    color: colors.gray07,
  },
  duplicateMessageText: {
    textAlign: 'left',
  },
  duplicateSuccessText: {
    color: colors.gray07,
  },
  saveButton: {
    marginTop: 'auto',
    marginBottom: 70,
    marginHorizontal: 16,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray03,
  },
  saveButtonActive: {
    backgroundColor: colors.main05,
  },
  saveButtonText: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
});
