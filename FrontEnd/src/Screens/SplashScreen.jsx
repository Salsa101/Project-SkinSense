import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/Logo.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7EBE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SplashScreen;
