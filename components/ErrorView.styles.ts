import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 70,
  },
  container: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontFamily: typography.SB,
    fontSize: 16,
    color: colors.black,
    marginBottom: 15,
  },
  subtitle: {
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.black,
    marginBottom: 20,
  },
  button: {
    alignSelf: 'flex-end',
    backgroundColor: colors.sub03,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    fontFamily: typography.SB,
    fontSize: 16,
    color: colors.white,
  },
});
