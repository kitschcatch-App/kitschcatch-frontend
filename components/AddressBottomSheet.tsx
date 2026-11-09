/**
 * 컴포넌트: 배송지 바텀 시트 (AddressBottomSheet)
 * 역할: 결제 화면 등에서 배송지를 변경하거나 목록에서 새로 선택할 때 하단에서 올라오는 바텀 시트 컴포넌트입니다.
 */


import React, { useEffect, useState } from 'react';
import { addressAPI } from '../api/apiClient';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './AddressBottomSheet.styles';

export interface SelectedAddress {
  id: number;
  name: string;
  phone: string;
  address: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (address: SelectedAddress) => void;
}

// API 응답 → 시트 표시용 형태 (기본 배송지가 서버에서 먼저 내려옴)
export const toSelectedAddress = (a: any): SelectedAddress & { isDefault: boolean } => ({
  id: a.id,
  name: a.recipientName,
  phone: a.recipientPhone,
  address: [a.addressLine1, a.addressLine2].filter(Boolean).join(' '),
  isDefault: a.isDefault,
});

const AddressBottomSheet = ({ visible, onClose, onSelect }: Props) => {
  const insets = useSafeAreaInsets();
  const [addresses, setAddresses] = useState<(SelectedAddress & { isDefault: boolean })[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 열릴 때마다 최신 목록 조회 (관리 화면에서 바뀐 내용 반영)
  useEffect(() => {
    if (!visible) return;
    addressAPI
      .list()
      .then(res => {
        const list = res.data.data.map(toSelectedAddress);
        setAddresses(list);
        setSelectedId(prev => (list.some((a: any) => a.id === prev) ? prev : list[0]?.id ?? null));
      })
      .catch(e => console.error('배송지 목록 조회 실패:', e));
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.bottomSheetContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>
              
              <View style={styles.header}>
                <Text style={styles.title}>배송지 변경</Text>
              </View>
              
              <ScrollView 
                showsVerticalScrollIndicator={false} 
                style={styles.addressListContainer}
                contentContainerStyle={styles.addressListContent}
              >
                {addresses.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.addressItem, selectedId === item.id && styles.addressItemActive]}
                    onPress={() => setSelectedId(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.nameRow}>
                      <View style={styles.nameLeft}>
                        <Text style={styles.addressName}>{item.name}</Text>
                        {item.isDefault && (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultBadgeText}>기본배송지</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <Text style={styles.addressPhone}>{item.phone}</Text>
                    <Text style={styles.addressText}>{item.address}</Text>
                  </TouchableOpacity>
                ))}
                <Text style={styles.noticeText}>추가 배송지 등록 및 수정,삭제는 회원정보 {'>'} 배송지 관리에서 가능합니다. </Text>
              </ScrollView>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  const item = addresses.find(a => a.id === selectedId);
                  if (item) {
                    onSelect({ id: item.id, name: item.name, phone: item.phone, address: item.address });
                  }
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>선택완료</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddressBottomSheet;