import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert } from 'react-native';

import api from '../api';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/home', {
          withCredentials: true,
        });

        setUserData(response.data);
      } catch (err) {
        console.error(err);
        setError('Gagal mengambil data user. Silakan login kembali.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await api.post(
        '/logout',
        {},
        {
          withCredentials: true,
        },
      );

      Alert.alert('Sukses', 'Logout berhasil.');
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Gagal logout.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Selamat datang, {userData?.user?.username}!
      </Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loading: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold' },
  error: { color: 'red', fontSize: 16 },
});

export default HomeScreen;
