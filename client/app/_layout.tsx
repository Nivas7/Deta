import { store } from '@/app/store';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StatusBar as RNStatusBar, View } from 'react-native';
import { Provider } from 'react-redux';

export default function RootLayout() {
  return (
    <Provider store={store}>
      {Platform.OS === 'android' && (
        <View
          style={{
            height: RNStatusBar.currentHeight,
            backgroundColor: '#FFFFFF',
          }}
        />
      )}

      <StatusBar style="dark" translucent backgroundColor="transparent" />

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
    </Provider>
  );
}
