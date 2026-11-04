import { addInquiry, clearInquiries, getInquiries } from '../utils/inquiryStore';

describe('inquiryStore', () => {
  beforeEach(clearInquiries);

  it('최신 문의가 맨 앞에 오고 날짜는 YYYY.MM.DD 형식이다', () => {
    addInquiry({ id: 'A', type: '정산', content: '1' }, new Date(2026, 0, 5));
    addInquiry({ id: 'B', type: '오류·기타', content: '2' }, new Date(2026, 10, 23));
    expect(getInquiries().map(i => i.id)).toEqual(['B', 'A']);
    expect(getInquiries().map(i => i.date)).toEqual(['2026.11.23', '2026.01.05']);
  });
});
