export const CONDITION_DISPLAY_MAP: Record<string, string> = {
  NEW: '새상품',
  LIKE_NEW: '사용감 적음',
  USED: '사용감 있음',
  DAMAGED: '사용감 많음',
};

export const CATEGORY_DISPLAY_MAP: Record<string, string> = {
  ANIME_MANGA: '애니/만화',
  GAME: '게임',
  GOODS: '굿즈',
  COSPLAY: '코스프레',
  BOOK: '서적',
  MUSIC_VIDEO: '음반/영상',
  ETC: '기타',
};

export const CATEGORY_REVERSE_MAP: Record<string, string> = {
  '애니/만화': 'ANIME_MANGA',
  '게임': 'GAME',
  '굿즈': 'GOODS',
  '코스프레': 'COSPLAY',
  '서적': 'BOOK',
  '음반/영상': 'MUSIC_VIDEO',
  '기타': 'ETC',
};

export const STATUS_DISPLAY_MAP: Record<string, string> = {
  ON_SALE: '판매중',
  RESERVED: '예약중',
  SOLD_OUT: '판매완료',
};
