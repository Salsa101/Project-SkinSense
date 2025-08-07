import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import api from '../api';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/home');

        setTimeout(() => {
          if (response.data?.user) {
            navigation.replace('Home');
          } else {
            navigation.replace('AccountOption');
          }
        }, 2500);
      } catch (error) {
        console.log('Auth check failed:', error.message);
        setTimeout(() => {
          navigation.replace('AccountOption');
        }, 2500);
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/Logo.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF7F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SplashScreen;
