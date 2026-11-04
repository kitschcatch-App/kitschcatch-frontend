/**
 * 화면: 문의내역 (InquiryHistoryScreen)
 * 역할: 고객센터에서 내가 접수한 1:1 문의 목록을 보여주고, 항목을 눌러 본문을 펼쳐 볼 수 있는 화면입니다.
 */
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import ScreenHeader from '../../components/ScreenHeader';
import Collapsible from '../../components/Collapsible';
import DropdownIcon from '../../assets/dropdown.svg';
import DropdownReIcon from '../../assets/dropdown-re.svg';
import { getInquiries, Inquiry } from '../../utils/inquiryStore';
import { styles } from './InquiryHistoryScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'InquiryHistory'>;

const InquiryHistoryScreen = ({ navigation }: Props) => {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setItems(getInquiries());
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="문의내역" onBack={() => navigation.goBack()} />

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>문의내역이 없습니다.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {items.map(item => {
            const isExpanded = expandedId === item.id;
            return (
              <View key={item.id} style={styles.item}>
                <TouchableOpacity
                  style={styles.itemHeader}
                  activeOpacity={0.7}
                  onPress={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <View>
                    <Text style={styles.itemType}>{item.type}</Text>
                    <Text style={styles.itemDate}>{item.date}</Text>
                  </View>
                  {isExpanded ? (
                    <DropdownReIcon width={12} height={10} />
                  ) : (
                    <DropdownIcon width={12} height={10} />
                  )}
                </TouchableOpacity>
                <Collapsible expanded={isExpanded}>
                  <Text style={styles.itemContent}>{item.content}</Text>
                </Collapsible>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default InquiryHistoryScreen;
