/**
 * 유틸: 스플래시 → 로그인 전환 (splashTransition)
 * 역할: 스플래시 로고의 화면상 Y 좌표를 보관해, 로그인 화면 로고가 같은 자리에서 점프를 시작하게 합니다.
 * 한 번 쓰고 비우므로(consume) 이후 로그인 화면 재진입 시에는 애니메이션이 재생되지 않습니다.
 */
// 원 → 로고로 바뀐 직후의 납작한 자세 (스플래시와 로그인 점프의 시작 자세가 같아야 이어져 보임)
export const FLAT_SX = 1.25;
export const FLAT_SY = 0.05;
// 바닥(로고 박스 하단)을 고정한 채 scaleY=sy로 눌렸을 때 중심이 내려가는 양
export const groundShift = (size: number, sy: number) => (size * (1 - sy)) / 2;

// logo.png는 이미지 안에서 그림이 오른쪽 아래로 치우쳐 있음(불투명 영역 중심이 이미지 중심보다 +1.1%, +1.6%).
// 스플래시에서 그림이 화면 정중앙에 보이도록 로고 크기 대비 이만큼 반대로 옮긴다.
export const LOGO_OFFSET_X = -0.011;
export const LOGO_OFFSET_Y = -0.35;

let splashLogoY: number | null = null;

export const setSplashLogoY = (y: number) => {
  splashLogoY = y;
};

export const consumeSplashLogoY = (): number | null => {
  const y = splashLogoY;
  splashLogoY = null;
  return y;
};
