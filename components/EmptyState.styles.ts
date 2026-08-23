import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  image: {
    width: 140,
    height: 145,
    marginBottom: 16,
  },
  title: {
    fontFamily: typography.SB,
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
  },
  description: {
    fontFamily: typography.SB,
    fontSize: 14,
    color: colors.sub07,
    textAlign: 'center',
    marginTop: 4,
  },
});
