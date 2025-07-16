import { store } from '@/state/store';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import SplashScreen from '@/presentation/screens/SpalshScreen';

export default function RootLayout() {

  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <StatusBar style="dark" translucent={true} />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="AddJobScreen"
            options={{
              presentation: 'modal',
              title: 'Add Job Application',
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: '600',
                color: '#1E293B',
              },
            }}
          />
        </Stack>
      </SafeAreaView>
    </Provider>
  );
}
