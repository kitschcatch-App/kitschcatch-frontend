import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { MockModeProvider, useMockMode } from '../contexts/MockModeContext';

let hookValue: ReturnType<typeof useMockMode>;

const TestConsumer = () => {
  hookValue = useMockMode();
  return null;
};

describe('MockModeContext', () => {
  describe('초기 상태', () => {
    it('isMockMode 초기값은 false이다', () => {
      act(() => {
        renderer.create(
          <MockModeProvider>
            <TestConsumer />
          </MockModeProvider>,
        );
      });
      expect(hookValue.isMockMode).toBe(false);
    });

    it('toggleMockMode는 함수로 제공된다', () => {
      act(() => {
        renderer.create(
          <MockModeProvider>
            <TestConsumer />
          </MockModeProvider>,
        );
      });
      expect(typeof hookValue.toggleMockMode).toBe('function');
    });
  });

  describe('toggleMockMode', () => {
    let testRenderer: renderer.ReactTestRenderer;

    beforeEach(() => {
      act(() => {
        testRenderer = renderer.create(
          <MockModeProvider>
            <TestConsumer />
          </MockModeProvider>,
        );
      });
    });

    afterEach(() => {
      act(() => {
        testRenderer.unmount();
      });
    });

    it('호출 시 isMockMode가 false → true로 변경된다', () => {
      expect(hookValue.isMockMode).toBe(false);

      act(() => { hookValue.toggleMockMode(); });

      expect(hookValue.isMockMode).toBe(true);
    });

    it('두 번 호출하면 false → true → false로 토글된다', () => {
      act(() => { hookValue.toggleMockMode(); });
      expect(hookValue.isMockMode).toBe(true);

      act(() => { hookValue.toggleMockMode(); });
      expect(hookValue.isMockMode).toBe(false);
    });

    it('여러 번 호출해도 홀수 번은 true, 짝수 번은 false이다', () => {
      for (let i = 1; i <= 5; i++) {
        act(() => { hookValue.toggleMockMode(); });
        expect(hookValue.isMockMode).toBe(i % 2 === 1);
      }
    });
  });

  describe('Provider 없이 사용 시 기본값', () => {
    it('isMockMode 기본값은 false이다', () => {
      act(() => {
        renderer.create(<TestConsumer />);
      });
      expect(hookValue.isMockMode).toBe(false);
    });

    it('toggleMockMode는 no-op 함수로 제공된다 (에러 없이 호출 가능)', () => {
      act(() => {
        renderer.create(<TestConsumer />);
      });
      expect(() => hookValue.toggleMockMode()).not.toThrow();
    });
  });
});
