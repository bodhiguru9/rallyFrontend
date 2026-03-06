import React from 'react';
import { FlexView } from '@components';
import { ActivityIndicator, StyleSheet, Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '@theme';

export const Loader: React.FC = () => {
    return (
        <FlexView style={styles.container}>
            {Platform.OS === 'android' ? (
                <View style={styles.blurView}>
                    <FlexView style={styles.content}>
                        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
                    </FlexView>
                </View>
            ) : (
                <BlurView intensity={20} tint="dark" style={styles.blurView}>
                    <FlexView style={styles.content}>
                        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
                    </FlexView>
                </BlurView>
            )}
        </FlexView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    blurView: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        width: 40,
        height: 40,
        transform: [{ scale: 1.1 }], // Scale to approximately 40px (large is ~36px)
    },
});
