import { getOpenStatus, formatWeeklyHours, BusinessHour } from '../utils/storeHours';

const day = (dayOfWeek: string, openTime: string | null, closeTime: string | null, closed = false): BusinessHour => ({
  dayOfWeek, openTime, closeTime, closed,
});
// 2026-10-07은 수요일
const at = (hh: number, mm = 0) => new Date(2026, 9, 7, hh, mm);

describe('getOpenStatus', () => {
  const hours = [day('TUESDAY', '11:00:00', '21:00:00'), day('WEDNESDAY', '11:00:00', '21:00:00'), day('THURSDAY', null, null, true)];

  it('영업시간 안이면 OPEN과 종료 시각을 반환한다', () => {
    expect(getOpenStatus(hours, at(15))).toEqual({ status: 'OPEN', closeTime: '21:00' });
  });

  it('영업시간 밖이거나 휴무일이면 CLOSED', () => {
    expect(getOpenStatus(hours, at(10, 59))).toEqual({ status: 'CLOSED' });
    expect(getOpenStatus(hours, at(21))).toEqual({ status: 'CLOSED' });
    expect(getOpenStatus([day('WEDNESDAY', null, null, true)], at(15))).toEqual({ status: 'CLOSED' });
  });

  it('영업시간 정보가 없으면 UNKNOWN', () => {
    expect(getOpenStatus([], at(15))).toEqual({ status: 'UNKNOWN' });
  });

  it('closeTime이 openTime 이하이면 다음 날 새벽까지 영업한다', () => {
    const night = [day('TUESDAY', '18:00', '02:00'), day('WEDNESDAY', '18:00', '02:00')];
    expect(getOpenStatus(night, at(1))).toEqual({ status: 'OPEN', closeTime: '02:00' }); // 전날 영업의 연장
    expect(getOpenStatus(night, at(12))).toEqual({ status: 'CLOSED' });
    expect(getOpenStatus(night, at(23))).toEqual({ status: 'OPEN', closeTime: '02:00' });
  });

  it('open과 close가 같으면 24시간 영업이다', () => {
    const all = [day('TUESDAY', '00:00', '00:00'), day('WEDNESDAY', '00:00', '00:00')];
    expect(getOpenStatus(all, at(13)).status).toBe('OPEN');
  });
});

describe('formatWeeklyHours', () => {
  it('요일별 문구를 만든다', () => {
    expect(formatWeeklyHours([day('MONDAY', '11:00:00', '21:00:00'), day('SUNDAY', null, null, true)])).toEqual([
      '월 11:00 ~ 21:00',
      '일 휴무',
    ]);
  });
});
