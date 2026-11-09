/**
 * 최근 본 상품 ID 목록 (기기 로컬 저장). 홈 '최근 본 상품과 비슷한 상품' 추천 API 입력으로 쓴다.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'recentViewedPostIds';
// 추천 API가 받는 최대 개수
export const MAX_RECENT_VIEWED = 20;

// 맨 앞에 추가(최신순), 중복 제거, 최대 개수 유지
export const pushRecent = (list: number[], id: number): number[] =>
  [id, ...list.filter(x => x !== id)].slice(0, MAX_RECENT_VIEWED);

export const getRecentViewed = async (): Promise<number[]> => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addRecentViewed = async (id: number | string): Promise<void> => {
  const n = Number(id);
  if (!Number.isFinite(n)) return;
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(pushRecent(await getRecentViewed(), n)));
  } catch {
    // 저장 실패는 추천 품질에만 영향 — 무시
  }
};
