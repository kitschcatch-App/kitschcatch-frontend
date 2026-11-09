import { secureStorage } from '../utils/secureStorage';
import { userAPI } from '../api/apiClient';
import { isAutoLoginValid } from '../utils/autoLogin';

jest.mock('../utils/secureStorage', () => ({ secureStorage: { getItem: jest.fn() } }));
jest.mock('../api/apiClient', () => ({ userAPI: { getMe: jest.fn() } }));

const hasToken = (v: string | null) => (secureStorage.getItem as jest.Mock).mockResolvedValue(v);

describe('isAutoLoginValid', () => {
  beforeEach(() => jest.clearAllMocks());

  it('토큰이 없으면 false (서버 호출 안 함)', async () => {
    hasToken(null);
    expect(await isAutoLoginValid()).toBe(false);
    expect(userAPI.getMe).not.toHaveBeenCalled();
  });

  it('토큰 있고 getMe 성공이면 true', async () => {
    hasToken('t');
    (userAPI.getMe as jest.Mock).mockResolvedValue({ data: { data: { profileRegistered: true } } });
    expect(await isAutoLoginValid()).toBe(true);
  });

  it('프로필 미등록이면 false', async () => {
    hasToken('t');
    (userAPI.getMe as jest.Mock).mockResolvedValue({ data: { data: { profileRegistered: false } } });
    expect(await isAutoLoginValid()).toBe(false);
  });

  it('401 응답이면 false', async () => {
    hasToken('t');
    (userAPI.getMe as jest.Mock).mockRejectedValue({ response: { status: 401 } });
    expect(await isAutoLoginValid()).toBe(false);
  });

  it('네트워크 오류(응답 없음)면 true', async () => {
    hasToken('t');
    (userAPI.getMe as jest.Mock).mockRejectedValue(new Error('Network Error'));
    expect(await isAutoLoginValid()).toBe(true);
  });
});
