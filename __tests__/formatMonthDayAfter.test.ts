import { formatMonthDayAfter } from '../utils/mypage';

describe('formatMonthDayAfter', () => {
  it('결제일에 일수를 더해 월/일로 반환한다', () => {
    expect(formatMonthDayAfter('2026-08-07T14:30:00', 3)).toBe('8월 10일');
  });
  it('월·연 경계를 넘긴다', () => {
    expect(formatMonthDayAfter('2026-12-30T10:00:00', 3)).toBe('1월 2일');
  });
  it('값이 없으면 빈 문자열', () => {
    expect(formatMonthDayAfter(undefined, 3)).toBe('');
  });
});
