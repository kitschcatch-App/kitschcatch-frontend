import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { styles } from './MyPageScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyPageScreen = () => {
    
    
    
    
    
    
    
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>채팅</Text>
            </View>
        </SafeAreaView>
    )
}

export default MyPageScreen;