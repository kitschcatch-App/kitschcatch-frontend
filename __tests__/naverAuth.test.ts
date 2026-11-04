import { Linking } from 'react-native';
import { parseNaverCallback, waitForNaverCode, NAVER_CANCELLED } from '../utils/naverAuth';

describe('parseNaverCallback', () => {
  it('code와 state를 추출한다', () => {
    expect(parseNaverCallback('kitschcatch://naver?code=abc%2B1&state=xyz')).toEqual({
      code: 'abc+1',
      state: 'xyz',
    });
  });

  it('error 콜백은 error를 반환한다', () => {
    expect(parseNaverCallback('kitschcatch://naver?error=access_denied&state=xyz')).toEqual({
      error: 'access_denied',
      state: 'xyz',
    });
  });

  it('네이버 콜백이 아니면 null', () => {
    expect(parseNaverCallback('kitschcatch://product/1')).toBeNull();
  });
});

describe('waitForNaverCode', () => {
  const setup = () => {
    let handler!: (e: { url: string }) => void;
    const remove = jest.fn();
    jest.spyOn(Linking, 'addEventListener').mockImplementation(((_: string, h: any) => {
      handler = h;
      return { remove };
    }) as any);
    return { emit: (url: string) => handler({ url }), remove };
  };

  it('state가 일치하는 콜백의 code로 resolve하고 리스너를 해제한다', async () => {
    const { emit, remove } = setup();
    const p = waitForNaverCode('s1');
    emit('kitschcatch://naver?code=other&state=s2'); // 다른 state는 무시
    emit('kitschcatch://naver?code=good&state=s1');
    await expect(p).resolves.toBe('good');
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('error 콜백이면 NAVER_CANCELLED로 reject한다', async () => {
    const { emit } = setup();
    const p = waitForNaverCode('s1');
    emit('kitschcatch://naver?error=access_denied&state=s1');
    await expect(p).rejects.toThrow(NAVER_CANCELLED);
  });
});
