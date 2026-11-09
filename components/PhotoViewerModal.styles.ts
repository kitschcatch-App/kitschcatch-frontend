/**
 * 스타일: 사진 상세보기 모달 스타일 (PhotoViewerModal.styles)
 */
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
  },
  // ScrollView는 기본으로 남는 높이를 채워 사진이 위로 붙으므로 내용 높이만 차지하게 함
  pager: {
    flexGrow: 0,
  },
  exitButton: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
