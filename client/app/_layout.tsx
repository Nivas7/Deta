import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, SafeAreaView, View, StatusBar as RNStatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <>
      {/* 1️⃣ Add a background behind the status bar for Android edge-to-edge */}
      {Platform.OS === 'android' && (
        <View
          style={{
            height: RNStatusBar.currentHeight,
            backgroundColor: '#FFFFFF',
          }}
        />
      )}

      {/* 2️⃣ Use expo-status-bar, style only */}
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* 3️⃣ Stack Navigator */}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal/add-job"
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
    </>
  );
}
