/**
 * 유틸: 1:1 문의 임시 저장소 (inquiryStore)
 * 역할: 문의 API가 없는 동안 접수한 문의를 앱 실행 중 메모리에 보관해 문의내역 화면에서 보여줍니다.
 * ponytail: 앱을 종료하면 사라짐. 문의 API가 생기면 이 모듈을 API 호출로 교체.
 */
export interface Inquiry {
  id: string;
  type: string;
  content: string;
  /** 'YYYY.MM.DD' */
  date: string;
}

let inquiries: Inquiry[] = [];

const pad = (n: number) => String(n).padStart(2, '0');

export const formatInquiryDate = (d: Date): string =>
  `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;

/** 최신 문의가 맨 앞에 오도록 추가 */
export const addInquiry = (
  inquiry: Omit<Inquiry, 'date'>,
  now: Date = new Date(),
) => {
  inquiries = [{ ...inquiry, date: formatInquiryDate(now) }, ...inquiries];
};

export const getInquiries = (): Inquiry[] => inquiries;

export const clearInquiries = () => {
  inquiries = [];
};
