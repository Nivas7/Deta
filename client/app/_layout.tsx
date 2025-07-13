import { store } from '@/state/store';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RootLayout() {
  const insets = useSafeAreaInsets();

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
