import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';

// Hook back handler
export const useCustomBackHandler = onBackPress => {
  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        if (onBackPress) {
          onBackPress();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBack,
      );

      return () => subscription.remove();
    }, [onBackPress]),
  );
};

// Hook exit app
export const useExitAppHandler = () => {
  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBack,
      );

      return () => subscription.remove();
    }, []),
  );
};
