jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

import { pushRecent, MAX_RECENT_VIEWED } from '../utils/recentViewed';

describe('pushRecent', () => {
  it('최신 ID를 맨 앞에 두고 중복은 제거한다', () => {
    expect(pushRecent([1, 2, 3], 2)).toEqual([2, 1, 3]);
  });

  it('최대 20개까지만 유지한다', () => {
    const list = Array.from({ length: MAX_RECENT_VIEWED }, (_, i) => i + 1);
    const next = pushRecent(list, 100);
    expect(next).toHaveLength(MAX_RECENT_VIEWED);
    expect(next[0]).toBe(100);
    expect(next).not.toContain(MAX_RECENT_VIEWED);
  });
});
