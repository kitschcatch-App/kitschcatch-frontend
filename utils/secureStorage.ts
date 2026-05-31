import * as Keychain from 'react-native-keychain';

const SVC_PREFIX = 'com.kitschatch.';

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    const result = await Keychain.getGenericPassword({ service: SVC_PREFIX + key });
    return result ? result.password : null;
  },

  async setItem(key: string, value: string): Promise<void> {
    await Keychain.setGenericPassword(key, value, { service: SVC_PREFIX + key });
  },

  async removeItem(key: string): Promise<void> {
    await Keychain.resetGenericPassword({ service: SVC_PREFIX + key });
  },
};
