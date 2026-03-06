import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          /* eslint-disable @typescript-eslint/no-require-imports */
          'Roboto-Regular': require('../../assets/fonts/Roboto-Regular.ttf'),
          'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
          'Roboto-Bold': require('../../assets/fonts/Roboto-Bold.ttf'),
          'NotoSans-Regular': require('../../assets/fonts/NotoSans-Regular.ttf'),
          'NotoSans-Medium': require('../../assets/fonts/NotoSans-Medium.ttf'),
          'NotoSans-SemiBold': require('../../assets/fonts/NotoSans-SemiBold.ttf'),
          'NotoSans-Bold': require('../../assets/fonts/NotoSans-Bold.ttf'),
          /* eslint-enable @typescript-eslint/no-require-imports */
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        // Set fonts loaded to true even on error to prevent infinite loading
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  return fontsLoaded;
};
