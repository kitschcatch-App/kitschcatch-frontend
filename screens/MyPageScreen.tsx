import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { styles } from './MyPageScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import NextIcon from '../assets/next.svg';

const MyPageScreen = () => {
    
    
    
    
    
    
    
    return (
        // 헤더 컨테이너
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>회원정보</Text>
            </View>
            
            // 사용자 프로필 컨테이너
            <View style={styles.profileContainer}>
                <View style={styles.profileImage}></View>
                <View style={styles.profileInfo}>
                    <View style={styles.nameRow}>
                        <View>
                            <Text style={styles.username}>졸린코끼리</Text>
                            <Text style={styles.introduction}>원신, 하이큐 굿즈 모아요</Text>
                        </View>
                        <NextIcon
                          width={7}
                          height={20}
                          style={styles.NextIcon}
                        />
                    </View>

                    <View style={styles.followCountContainer}>
                        <Text style={styles.followCount}>팔로우 1</Text>
                        <Text style={styles.followDivider}>|</Text>
                        <Text style={styles.followCount}>팔로잉 8</Text>
                        <Text style={styles.followDivider}>|</Text>
                        <Text style={styles.followCount}>별점 4.1</Text>
                    </View>
                </View>
            </View>

            //활동 컨테이너
        </SafeAreaView>
    )
}

export default MyPageScreen;