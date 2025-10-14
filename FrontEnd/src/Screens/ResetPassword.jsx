import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import api from '../api';

const ResetPassword = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!otp.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      return Alert.alert('Peringatan', 'Semua field harus diisi!');
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert(
        'Peringatan',
        'Password baru dan konfirmasi tidak sama!',
      );
    }

    try {
      setLoading(true);
      const res = await api.post('/reset-password', {
        email,
        otp,
        newPassword,
      });

      Alert.alert('Berhasil', res.data.message);
      navigation.navigate('SignIn');
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Gagal mereset password.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Masukkan kode OTP yang dikirim ke email dan password baru kamu.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Kode OTP"
        placeholderTextColor={'#000000'}
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Password Baru"
        placeholderTextColor={'#000000'}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Konfirmasi Password"
        placeholderTextColor={'#000000'}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Mengirim...' : 'Reset Password'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResetPassword;
