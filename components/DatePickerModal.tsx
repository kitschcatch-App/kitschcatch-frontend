/**
 * 컴포넌트: 날짜 선택 모달 (DatePickerModal)
 * 역할: 년/월/일을 각각 세로로 스크롤하여 선택하는 휠 형태의 팝업 모달창입니다.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { styles, ITEM_HEIGHT, VISIBLE_ITEMS } from './DatePickerModal.styles';

export interface SelectedDate {
  year: number;
  month: number;
  day: number;
}

interface DatePickerModalProps {
  visible: boolean;
  value: SelectedDate | null;
  onClose: () => void;
  onConfirm: (date: SelectedDate) => void;
}

const PADDING_ITEMS = Math.floor(VISIBLE_ITEMS / 2);
const YEAR_RANGE = 6;

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

const DatePickerModal = ({ visible, value, onClose, onConfirm }: DatePickerModalProps) => {
  const today = useMemo(() => new Date(), []);
  const baseYear = today.getFullYear() - 1;
  const YEARS = useMemo(() => Array.from({ length: YEAR_RANGE }, (_, i) => baseYear + i), [baseYear]);
  const MONTHS = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const initialDate: SelectedDate = value ?? {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  };

  const [selectedYear, setSelectedYear] = useState(initialDate.year);
  const [selectedMonth, setSelectedMonth] = useState(initialDate.month);
  const [selectedDay, setSelectedDay] = useState(initialDate.day);

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const DAYS = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  const yearListRef = useRef<FlatList<number>>(null);
  const monthListRef = useRef<FlatList<number>>(null);
  const dayListRef = useRef<FlatList<number>>(null);

  useEffect(() => {
    if (!visible) return;
    const next = value ?? {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
    setSelectedYear(next.year);
    setSelectedMonth(next.month);
    setSelectedDay(next.day);

    const yearIndex = Math.max(0, YEARS.indexOf(next.year));
    const monthIndex = next.month - 1;
    const dayIndex = next.day - 1;

    const timer = setTimeout(() => {
      yearListRef.current?.scrollToOffset({ offset: yearIndex * ITEM_HEIGHT, animated: false });
      monthListRef.current?.scrollToOffset({ offset: monthIndex * ITEM_HEIGHT, animated: false });
      dayListRef.current?.scrollToOffset({ offset: dayIndex * ITEM_HEIGHT, animated: false });
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
      requestAnimationFrame(() => {
        dayListRef.current?.scrollToOffset({ offset: (daysInMonth - 1) * ITEM_HEIGHT, animated: true });
      });
    }
  }, [daysInMonth, selectedDay]);

  const handleScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    items: number[],
    setSelected: (value: number) => void,
  ) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    setSelected(items[clamped]);
  };

  const handleConfirm = () => {
    onConfirm({ year: selectedYear, month: selectedMonth, day: selectedDay });
  };

  const renderColumn = (
    listRef: React.RefObject<FlatList<number>>,
    items: number[],
    selectedValue: number,
    setSelected: (value: number) => void,
    unit: string,
  ) => (
    <FlatList
      ref={listRef}
      data={items}
      keyExtractor={(item) => String(item)}
      style={styles.wheelColumn}
      contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * PADDING_ITEMS }}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      bounces={false}
      scrollEventThrottle={16}
      getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
      onScroll={(e) => handleScroll(e, items, setSelected)}
      onMomentumScrollEnd={(e) => handleScroll(e, items, setSelected)}
      renderItem={({ item }) => {
        const isSelected = item === selectedValue;
        return (
          <View style={styles.wheelItem}>
            <Text style={[styles.wheelItemText, isSelected && styles.wheelItemTextSelected]}>
              {item}{unit}
            </Text>
          </View>
        );
      }}
    />
  );

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.wheelWrapper}>
              <View style={styles.selectionBar} pointerEvents="none" />
              <View style={styles.wheelRow}>
                {renderColumn(yearListRef, YEARS, selectedYear, setSelectedYear, '')}
                {renderColumn(monthListRef, MONTHS, selectedMonth, setSelectedMonth, '월')}
                {renderColumn(dayListRef, DAYS, selectedDay, setSelectedDay, '일')}
              </View>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.textButton} onPress={onClose} activeOpacity={0.6}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.textButton} onPress={handleConfirm} activeOpacity={0.6}>
              <Text style={styles.confirmButtonText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DatePickerModal;
