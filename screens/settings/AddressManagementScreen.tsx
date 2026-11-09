/**
 * 화면: 배송지 관리 (AddressManagementScreen)
 * 역할: 등록된 배송지 목록을 보여주고 각 배송지를 삭제/수정할 수 있는 화면입니다.
 */
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { addressAPI } from '../../api/apiClient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './AddressManagementScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';
import ConfirmView from '../../components/ConfirmView';
import SuccessView from '../../components/SuccessView';

type Props = NativeStackScreenProps<RootStackParamList, 'AddressManagement'>;

interface Address {
  id: string;
  name: string;
  phone: string;
  zipCode: string;
  address: string;
  detailAddress: string;
  isDefault?: boolean;
}

const AddressManagementScreen = ({ navigation }: Props) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isSuccessVisible, setSuccessVisible] = useState(false);

  // 등록/수정 화면에서 돌아올 때도 최신 목록을 다시 불러온다.
  const load = useCallback(() => {
    addressAPI
      .list()
      .then(res =>
        setAddresses(
          res.data.data.map((a: any) => ({
            id: String(a.id),
            name: a.recipientName,
            phone: a.recipientPhone,
            zipCode: a.postalCode,
            address: a.addressLine1,
            detailAddress: a.addressLine2 ?? '',
            isDefault: a.isDefault,
          })),
        ),
      )
      .catch(e => console.error('배송지 목록 조회 실패:', e));
  }, []);
  useFocusEffect(load);

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return;
    try {
      await addressAPI.remove(deleteTargetId);
    } catch (e) {
      console.error('배송지 삭제 실패:', e);
      setDeleteTargetId(null);
      Alert.alert('배송지', '배송지를 삭제하지 못했어요. 다시 시도해주세요.');
      return;
    }
    setDeleteTargetId(null);
    setSuccessVisible(true);
    load();
  };

  const handleEdit = (item: Address) => {
    navigation.navigate('AddressRegistration', { address: item });
  };

  const handleRegister = () => {
    navigation.navigate('AddressRegistration');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="배송지 관리" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {addresses.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.addressCard,
              !item.isDefault && styles.addressCardPlain,
              index > 0 && styles.addressCardSpacing,
            ]}
          >
            <View style={styles.nameRow}>
              <Text style={styles.name}>{item.name}</Text>
              {item.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>기본배송지</Text>
                </View>
              )}
            </View>

            <Text style={styles.phone}>{item.phone}</Text>

            <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
              {item.address}
            </Text>

            <Text style={styles.detailAddress} numberOfLines={1} ellipsizeMode="tail">
              {item.detailAddress}
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.7}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>삭제</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.7}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.actionButtonText}>수정</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.registerButton}
          activeOpacity={0.8}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>배송지 등록</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmView
        visible={deleteTargetId !== null}
        title="배송지를 삭제하시겠습니까?"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
      />

      <SuccessView
        visible={isSuccessVisible}
        title="배송지가 삭제되었습니다."
        onDismiss={() => setSuccessVisible(false)}
      />
    </SafeAreaView>
  );
};

export default AddressManagementScreen;
