import * as Keychain from 'react-native-keychain';

const SVC_PREFIX = 'com.kitschatch.';

// 요청마다 Keychain(네이티브 복호화)을 읽지 않도록 메모리 캐시. set/remove가 항상 이 모듈을 거치므로 일관성 유지.
const cache = new Map<string, string | null>();

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    if (cache.has(key)) return cache.get(key)!;
    const result = await Keychain.getGenericPassword({ service: SVC_PREFIX + key });
    const value = result ? result.password : null;
    cache.set(key, value);
    return value;
  },

  async setItem(key: string, value: string): Promise<void> {
    await Keychain.setGenericPassword(key, value, { service: SVC_PREFIX + key });
    cache.set(key, value);
  },

  async removeItem(key: string): Promise<void> {
    await Keychain.resetGenericPassword({ service: SVC_PREFIX + key });
    cache.set(key, null);
  },
};
