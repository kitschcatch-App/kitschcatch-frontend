import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/apiClient';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;
const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;

// 성공 응답 어댑터 헬퍼
const makeSuccessAdapter = (data = {}) =>
  async (config: InternalAxiosRequestConfig) => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    request: {},
  });

// 401 AxiosError 생성 헬퍼
const make401Error = (config: InternalAxiosRequestConfig): AxiosError => {
  const response = {
    data: null,
    status: 401,
    statusText: 'Unauthorized',
    headers: {},
    config,
    request: null,
  };
  return new AxiosError(
    'Request failed with status code 401',
    'ERR_BAD_REQUEST',
    config,
    null,
    response as any,
  );
};

// apiClient에 커스텀 어댑터를 붙여 요청하는 헬퍼
const request = (adapterFn: (config: InternalAxiosRequestConfig) => Promise<any>, url = '/test') =>
  apiClient.get(url, { adapter: adapterFn });

// ─────────────────────────────────────────────────────────────────────────────
// 요청 인터셉터: Authorization 헤더 주입
// ─────────────────────────────────────────────────────────────────────────────
describe('apiClient - 요청 인터셉터', () => {
  beforeEach(() => jest.clearAllMocks());

  it('accessToken이 있으면 Authorization: Bearer 헤더를 추가한다', async () => {
    mockGetItem.mockResolvedValue('my-access-token');

    let capturedHeaders: any;
    await request(async (config) => {
      capturedHeaders = config.headers;
      return (await makeSuccessAdapter())(config);
    });

    expect(capturedHeaders.Authorization).toBe('Bearer my-access-token');
  });

  it('accessToken이 없으면 Authorization 헤더를 추가하지 않는다', async () => {
    mockGetItem.mockResolvedValue(null);

    let capturedHeaders: any;
    await request(async (config) => {
      capturedHeaders = config.headers;
      return (await makeSuccessAdapter())(config);
    });

    expect(capturedHeaders.Authorization).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 응답 인터셉터: 401 → Refresh Token 자동 갱신
// ─────────────────────────────────────────────────────────────────────────────
describe('apiClient - 응답 인터셉터 (토큰 자동 갱신)', () => {
  let axiosPostSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    axiosPostSpy = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    axiosPostSpy.mockRestore();
  });

  it('401 응답 시 refreshToken으로 토큰을 갱신하고 요청을 재시도한다', async () => {
    mockGetItem.mockImplementation((key: string) =>
      Promise.resolve(key === 'refreshToken' ? 'stored-refresh-token' : null),
    );
    axiosPostSpy.mockResolvedValueOnce({
      data: { data: { accessToken: 'new-access', refreshToken: 'new-refresh' } },
    });

    let callCount = 0;
    const response = await request(async (config) => {
      callCount++;
      if (callCount === 1) throw make401Error(config);
      return (await makeSuccessAdapter({ retried: true }))(config);
    });

    expect(callCount).toBe(2);
    expect(response.data).toEqual({ retried: true });
  });

  it('갱신 성공 시 새 토큰을 AsyncStorage에 저장한다', async () => {
    mockGetItem.mockImplementation((key: string) =>
      Promise.resolve(key === 'refreshToken' ? 'stored-refresh-token' : null),
    );
    axiosPostSpy.mockResolvedValueOnce({
      data: { data: { accessToken: 'new-access', refreshToken: 'new-refresh' } },
    });

    let callCount = 0;
    await request(async (config) => {
      callCount++;
      if (callCount === 1) throw make401Error(config);
      return (await makeSuccessAdapter())(config);
    });

    expect(mockSetItem).toHaveBeenCalledWith('accessToken', 'new-access');
    expect(mockSetItem).toHaveBeenCalledWith('refreshToken', 'new-refresh');
  });

  it('refreshToken이 없으면 토큰 삭제 없이 401 에러를 그대로 전달한다', async () => {
    mockGetItem.mockResolvedValue(null); // accessToken도 없음, refreshToken도 없음

    await expect(
      request(async (config) => { throw make401Error(config); }),
    ).rejects.toMatchObject({ response: { status: 401 } });

    expect(axiosPostSpy).not.toHaveBeenCalled();
    expect(mockRemoveItem).not.toHaveBeenCalled();
  });

  it('refresh 요청 자체가 실패하면 accessToken, refreshToken을 삭제한다', async () => {
    mockGetItem.mockImplementation((key: string) =>
      Promise.resolve(key === 'refreshToken' ? 'stored-refresh-token' : null),
    );
    axiosPostSpy.mockRejectedValueOnce(new Error('refresh 서버 오류'));

    await expect(
      request(async (config) => { throw make401Error(config); }),
    ).rejects.toThrow('refresh 서버 오류');

    expect(mockRemoveItem).toHaveBeenCalledWith('accessToken');
    expect(mockRemoveItem).toHaveBeenCalledWith('refreshToken');
  });

  it('/auth/token/refresh 경로에서 401 발생 시 토큰을 삭제하고 무한 루프 없이 종료한다', async () => {
    mockGetItem.mockResolvedValue(null);

    await expect(
      request(async (config) => { throw make401Error(config); }, '/auth/token/refresh'),
    ).rejects.toMatchObject({ response: { status: 401 } });

    expect(mockRemoveItem).toHaveBeenCalledWith('accessToken');
    expect(mockRemoveItem).toHaveBeenCalledWith('refreshToken');
    expect(axiosPostSpy).not.toHaveBeenCalled(); // 갱신 재시도 없음
  });

  it('401 동시 다발 요청 시 토큰 갱신은 한 번만 수행되고 모든 요청이 재시도된다', async () => {
    mockGetItem.mockImplementation((key: string) =>
      Promise.resolve(key === 'refreshToken' ? 'stored-refresh-token' : null),
    );
    axiosPostSpy.mockResolvedValueOnce({
      data: { data: { accessToken: 'new-access', refreshToken: 'new-refresh' } },
    });

    let callCount = 0;
    const adapter = async (config: InternalAxiosRequestConfig) => {
      callCount++;
      if (callCount <= 2) throw make401Error(config); // 첫 두 요청은 401
      return (await makeSuccessAdapter({ ok: true }))(config);
    };

    const [res1, res2] = await Promise.all([
      request(adapter),
      request(adapter),
    ]);

    expect(axiosPostSpy).toHaveBeenCalledTimes(1); // 갱신은 딱 1회
    expect(res1.data).toEqual({ ok: true });
    expect(res2.data).toEqual({ ok: true });
  });
});
