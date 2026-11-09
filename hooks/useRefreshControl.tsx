/**
 * 훅: 당겨서 새로고침 (useRefreshControl)
 * 역할: 목록/스크롤 화면의 refreshControl 속성에 바로 넘길 수 있는 RefreshControl을 만듭니다.
 *       reload가 끝날 때까지(실패해도) 스피너를 돌립니다.
 */
import React, { useState } from 'react';
import { RefreshControl } from 'react-native';

export const useRefreshControl = (reload: () => Promise<unknown>) => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await reload();
    } catch (e) {
      console.error('새로고침 실패:', e);
    } finally {
      setRefreshing(false);
    }
  };
  return <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;
};
