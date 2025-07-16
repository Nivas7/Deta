import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

export async function initializeApp(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1500));
}


export default function useSplashViewModel() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
      await initializeApp();
      setIsReady(true);
    };
    prepare();
  }, []);

  return { isReady };
}
