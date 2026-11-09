import { uploadImagesToS3, ImageAsset, PresignedEntry } from '../utils/uploadImages';

const mockBlob = new Blob(['mock image data']);

const image: ImageAsset = { uri: 'file:///photo.jpg', type: 'image/jpeg' };
const presigned: PresignedEntry = {
  uploadUrl: 'https://s3.example.com/upload?sig=abc',
  imageKey: 'products/key.jpg',
};

describe('uploadImagesToS3', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('업로드 성공 시 imageKey를 반환한다', async () => {
    fetchSpy
      .mockResolvedValueOnce({ blob: () => Promise.resolve(mockBlob) } as any)
      .mockResolvedValueOnce({ ok: true } as any);

    const result = await uploadImagesToS3([image], [presigned]);

    expect(result).toEqual(['products/key.jpg']);
  });

  it('S3 PUT 요청에 올바른 URL, method, body, Content-Type을 전달한다', async () => {
    fetchSpy
      .mockResolvedValueOnce({ blob: () => Promise.resolve(mockBlob) } as any)
      .mockResolvedValueOnce({ ok: true } as any);

    await uploadImagesToS3([image], [presigned]);

    const [url, options] = fetchSpy.mock.calls[1];
    expect(url).toBe(presigned.uploadUrl);
    expect(options.method).toBe('PUT');
    expect(options.body).toBe(mockBlob);
    expect(options.headers['Content-Type']).toBe('image/jpeg');
  });

  it('image.type이 없으면 Content-Type을 image/jpeg로 기본 설정한다', async () => {
    const imageWithoutType: ImageAsset = { uri: 'file:///photo.jpg' };
    fetchSpy
      .mockResolvedValueOnce({ blob: () => Promise.resolve(mockBlob) } as any)
      .mockResolvedValueOnce({ ok: true } as any);

    await uploadImagesToS3([imageWithoutType], [presigned]);

    const [, options] = fetchSpy.mock.calls[1];
    expect(options.headers['Content-Type']).toBe('image/jpeg');
  });

  it('S3 응답이 ok:false이면 에러를 던진다', async () => {
    fetchSpy
      .mockResolvedValueOnce({ blob: () => Promise.resolve(mockBlob) } as any)
      .mockResolvedValueOnce({ ok: false } as any);

    await expect(uploadImagesToS3([image], [presigned])).rejects.toThrow('S3 이미지 업로드 실패');
  });

  it('이미지 uri fetch 실패 시 에러를 전파한다', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('네트워크 오류'));

    await expect(uploadImagesToS3([image], [presigned])).rejects.toThrow('네트워크 오류');
  });

  it('이미지 여러 장을 병렬 업로드하고 순서대로 imageKey를 반환한다', async () => {
    const images: ImageAsset[] = [
      { uri: 'file:///photo1.jpg', type: 'image/jpeg' },
      { uri: 'file:///photo2.png', type: 'image/png' },
    ];
    const presignedList: PresignedEntry[] = [
      { uploadUrl: 'https://s3.example.com/upload1', imageKey: 'products/key1.jpg' },
      { uploadUrl: 'https://s3.example.com/upload2', imageKey: 'products/key2.png' },
    ];

    // Promise.all 병렬 실행 순서: fetch(uri1) → fetch(uri2) → PUT(url1) → PUT(url2)
    fetchSpy
      .mockResolvedValueOnce({ blob: () => Promise.resolve(mockBlob) } as any) // fetch(uri1)
      .mockResolvedValueOnce({ blob: () => Promise.resolve(mockBlob) } as any) // fetch(uri2)
      .mockResolvedValueOnce({ ok: true } as any)                              // PUT url1
      .mockResolvedValueOnce({ ok: true } as any);                             // PUT url2

    const result = await uploadImagesToS3(images, presignedList);

    expect(result).toEqual(['products/key1.jpg', 'products/key2.png']);
    expect(fetchSpy).toHaveBeenCalledTimes(4);
  });
});
