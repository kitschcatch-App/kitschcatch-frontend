/**
 * 컴포넌트: 정렬 바텀 시트 (SortBottomSheet)
 * 역할: 정렬 기준(최신순/오래된순)을 선택하는 하단 모달창입니다.
 */
import React from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, StyleProp, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './SortBottomSheet.styles';
import RadioOnIcon from '../assets/radiobutton-on.svg';

export type SortOption = '최신순' | '오래된순';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  onTitlePress?: () => void;
  selectedSort?: SortOption;
  onSelect?: (sort: SortOption) => void;
  /** 라디오 12px, 옵션 간격 16px의 촘촘한 레이아웃 */
  compact?: boolean;
}

const SORT_OPTIONS: SortOption[] = ['최신순', '오래된순'];

const SortBottomSheet = ({ visible, onClose, title = '정렬', titleStyle, onTitlePress, selectedSort, onSelect, compact }: Props) => {
  const insets = useSafeAreaInsets();
  const radioSize = compact ? 16 : 16;

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.bottomSheetContainer,
            compact && styles.bottomSheetCompact,
            { paddingBottom: Math.max(insets.bottom, compact ? 12 : 20) },
          ]}
        >
          {!compact && <View style={styles.handleContainer} />}

          {onTitlePress ? (
            <TouchableOpacity onPress={onTitlePress} activeOpacity={0.7}>
              <Text style={[styles.title, titleStyle]}>{title}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.title, titleStyle]}>{title}</Text>
          )}

          {onSelect && (
            <View style={[styles.optionsContainer, compact && styles.optionsCompact]}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.optionRow, compact && styles.optionRowCompact]}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                >
                  {selectedSort === option ? (
                    <RadioOnIcon width={radioSize} height={radioSize} />
                  ) : (
                    <View style={[styles.radioOff, compact && styles.radioOffCompact]} />
                  )}
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default SortBottomSheet;
