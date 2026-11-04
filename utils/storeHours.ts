/**
 * 유틸: 매장 영업시간 계산 (storeHours)
 * 역할: GET /stores/{id}의 businessHours로 현재 영업 여부와 요일별 영업시간 문구를 만듭니다.
 *       서버 규칙: 휴무일은 closed=true(시각 null), closeTime이 openTime 이하이면 다음 날 종료(같으면 24시간).
 */
export type BusinessHour = {
  dayOfWeek: string;
  openTime: string | null;
  closeTime: string | null;
  closed: boolean;
};

export type OpenStatus = { status: 'OPEN' | 'CLOSED' | 'UNKNOWN'; closeTime?: string };

const DAY_KEYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const DAY_LABELS: Record<string, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
};

const toMinutes = (time: string) => {
  const [h, m] = time.split(':');
  return Number(h) * 60 + Number(m);
};
const hhmm = (time: string) => time.slice(0, 5);

type OpenDay = BusinessHour & { openTime: string; closeTime: string };
const isOpenDay = (h?: BusinessHour): h is OpenDay => !!h && !h.closed && !!h.openTime && !!h.closeTime;

export function getOpenStatus(hours: BusinessHour[], now: Date = new Date()): OpenStatus {
  if (hours.length === 0) return { status: 'UNKNOWN' };

  const day = now.getDay();
  const today = hours.find(h => h.dayOfWeek === DAY_KEYS[day]);
  const yesterday = hours.find(h => h.dayOfWeek === DAY_KEYS[(day + 6) % 7]);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  // 어제 시작한 영업이 자정을 넘겨 오늘 새벽까지 이어지는 경우
  if (isOpenDay(yesterday)) {
    const open = toMinutes(yesterday.openTime);
    const close = toMinutes(yesterday.closeTime);
    if (close <= open && nowMin < close) return { status: 'OPEN', closeTime: hhmm(yesterday.closeTime) };
  }

  if (isOpenDay(today)) {
    const open = toMinutes(today.openTime);
    const close = toMinutes(today.closeTime);
    const isOpen = close > open ? nowMin >= open && nowMin < close : nowMin >= open;
    if (isOpen) return { status: 'OPEN', closeTime: hhmm(today.closeTime) };
  }

  return { status: 'CLOSED' };
}

/** 요일별 영업시간 문구 (월요일부터). 예: ['월 11:00 ~ 21:00', '일 휴무'] */
export function formatWeeklyHours(hours: BusinessHour[]): string[] {
  return hours.map(h => {
    const label = DAY_LABELS[h.dayOfWeek] ?? h.dayOfWeek;
    if (h.closed) return `${label} 휴무`;
    if (!h.openTime || !h.closeTime) return `${label} 정보 없음`;
    return `${label} ${hhmm(h.openTime)} ~ ${hhmm(h.closeTime)}`;
  });
}
