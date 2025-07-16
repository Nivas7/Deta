import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Image } from 'react-native';
import * as SplashScreenAPI from 'expo-splash-screen';
import useSplashViewModel from '@/viewmodels/splashViewModel';

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  const { isReady } = useSplashViewModel();

  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isReady) {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(async () => {
        await SplashScreenAPI.hideAsync();
        onFinish();
      });
    }
  }, [isReady]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Image
        source={require('../../assets/images/spalsh.png')}
        style={{ width: 300, height: 300 }}
        resizeMode="cover"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
