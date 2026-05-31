import { formatTime } from '../utils/formatTime';

// NOW = 2024-06-15T12:00:00+09:00 (= 2024-06-15T03:00:00Z)
const NOW = new Date('2024-06-15T12:00:00+09:00');

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(NOW);
});

afterAll(() => {
  jest.useRealTimers();
});

describe('formatTime - 경계값', () => {
  it('빈 문자열이면 빈 문자열을 반환한다', () => {
    expect(formatTime('')).toBe('');
  });

  it('유효하지 않은 날짜 문자열이면 원본을 그대로 반환한다', () => {
    expect(formatTime('invalid-date')).toBe('invalid-date');
  });

  it('미래 날짜이면 "YYYY. M. D." 형식으로 반환한다', () => {
    expect(formatTime('2024-12-25T12:00:00+09:00')).toBe('2024. 12. 25.');
  });
});

describe('formatTime - 방금 전', () => {
  it('정확히 현재 시각이면 "방금 전"을 반환한다', () => {
    expect(formatTime('2024-06-15T12:00:00+09:00')).toBe('방금 전');
  });

  it('30초 전이면 "방금 전"을 반환한다', () => {
    expect(formatTime('2024-06-15T11:59:30+09:00')).toBe('방금 전');
  });
});

describe('formatTime - 분 단위', () => {
  it('5분 전이면 "5분 전"을 반환한다', () => {
    expect(formatTime('2024-06-15T11:55:00+09:00')).toBe('5분 전');
  });

  it('59분 전이면 "59분 전"을 반환한다', () => {
    expect(formatTime('2024-06-15T11:01:00+09:00')).toBe('59분 전');
  });
});

describe('formatTime - 시간 단위', () => {
  it('2시간 전이면 "2시간 전"을 반환한다', () => {
    expect(formatTime('2024-06-15T10:00:00+09:00')).toBe('2시간 전');
  });

  it('23시간 전이면 "23시간 전"을 반환한다', () => {
    expect(formatTime('2024-06-14T13:00:00+09:00')).toBe('23시간 전');
  });
});

describe('formatTime - 일 단위', () => {
  it('3일 전이면 "3일 전"을 반환한다', () => {
    expect(formatTime('2024-06-12T12:00:00+09:00')).toBe('3일 전');
  });

  it('29일 전이면 "29일 전"을 반환한다', () => {
    // 2024-05-17 → 2024-06-15: 정확히 29일
    expect(formatTime('2024-05-17T12:00:00+09:00')).toBe('29일 전');
  });
});

describe('formatTime - 달 단위', () => {
  it('2달 전이면 "2달 전"을 반환한다', () => {
    // 2024-04-15 → 2024-06-15: 61일, floor(61/30) = 2
    expect(formatTime('2024-04-15T12:00:00+09:00')).toBe('2달 전');
  });

  it('11달 전이면 "11달 전"을 반환한다', () => {
    // 2023-07-15 → 2024-06-15: 336일, floor(336/30) = 11
    expect(formatTime('2023-07-15T12:00:00+09:00')).toBe('11달 전');
  });
});

describe('formatTime - 년 단위', () => {
  it('1년 전이면 "1년 전"을 반환한다', () => {
    // 2023-06-15 → 2024-06-15: 366일(윤년), floor(366/365) = 1
    expect(formatTime('2023-06-15T12:00:00+09:00')).toBe('1년 전');
  });
});

describe('formatTime - 타임존 처리', () => {
  it('타임존 표시 없는 날짜는 KST(+09:00)로 처리한다', () => {
    // '2024-06-15T11:55:00' → '2024-06-15T11:55:00+09:00' → 5분 전
    expect(formatTime('2024-06-15T11:55:00')).toBe('5분 전');
  });

  it('"Z" 타임존이 있는 날짜를 올바르게 처리한다', () => {
    // 2024-06-15T03:00:00Z = NOW이므로 "방금 전"
    expect(formatTime('2024-06-15T03:00:00Z')).toBe('방금 전');
  });
});
