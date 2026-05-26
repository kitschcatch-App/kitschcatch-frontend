/**
 * 컨텍스트: Mock 모드 전역 상태 (MockModeContext)
 * 역할: 앱 전체에서 Mock 모드 ON/OFF 상태를 공유합니다.
 *       Mock 모드가 ON이면 실제 API 대신 가상 데이터(mockData.ts)를 사용합니다.
 */
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MockModeContextType {
  isMockMode: boolean;
  toggleMockMode: () => void;
}

const MockModeContext = createContext<MockModeContextType>({
  isMockMode: false,
  toggleMockMode: () => {},
});

export const MockModeProvider = ({ children }: { children: ReactNode }) => {
  const [isMockMode, setIsMockMode] = useState(false);

  const toggleMockMode = () => setIsMockMode(prev => !prev);

  return (
    <MockModeContext.Provider value={{ isMockMode, toggleMockMode }}>
      {children}
    </MockModeContext.Provider>
  );
};

/** 컴포넌트에서 Mock 모드 상태를 읽고 토글하는 훅 */
export const useMockMode = () => useContext(MockModeContext);
