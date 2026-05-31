/**
 * 컴포넌트: 배송지 바텀 시트 (AddressBottomSheet)
 * 역할: 결제 화면 등에서 배송지를 변경하거나 목록에서 새로 선택할 때 하단에서 올라오는 바텀 시트 컴포넌트입니다.
 */


import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './AddressBottomSheet.styles';

export interface SelectedAddress {
  name: string;
  phone: string;
  address: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (address: SelectedAddress) => void;
}

const DUMMY_ADDRESSES = [
  {
    id: '1',
    name: '이수진',
    phone: '010-1234-5678',
    address: '경기도 화성시 병점구 안녕동 1245678845612546546543234354678',
    isDefault: true,
  },
  {
    id: '2',
    name: '홍길동',
    phone: '010-9876-5432',
    address: '서울특별시 강남구 테헤란로 123',
  }
];

const AddressBottomSheet = ({ visible, onClose, onSelect }: Props) => {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState('1');

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
                {DUMMY_ADDRESSES.map((item) => (
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
                      <TouchableOpacity><Text style={styles.deleteText}>삭제</Text></TouchableOpacity>
                    </View>
                    <Text style={styles.addressPhone}>{item.phone}</Text>
                    <Text style={styles.addressText}>{item.address}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  const item = DUMMY_ADDRESSES.find(a => a.id === selectedId)!;
                  onSelect({ name: item.name, phone: item.phone, address: item.address });
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>배송지 변경완료</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddressBottomSheet;