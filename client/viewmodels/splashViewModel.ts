import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

export async function initializeApp(): Promise<void> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API or DB
  } catch (err) {
    console.error('Error loading fonts', err);
  }
}

export default function useSplashViewModel() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await initializeApp();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    };
    prepare();
  }, []);

  return { isReady };
}
