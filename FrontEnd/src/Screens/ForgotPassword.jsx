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

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) return Alert.alert('Peringatan', 'Email harus diisi!');

    console.log('Mengirim email ke backend:', email);

    try {
      setLoading(true);
      const res = await api.post('/forgot-password', { email });

      Alert.alert('Berhasil', res.data.message);

      navigation.navigate('ResetPassword', { email });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Gagal mengirim OTP reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email to receive a password reset link.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleForgotPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sending...' : 'Send Reset Email'}
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
    fontFamily: 'Poppins-Bold',
    color: '#d94c64',
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
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#d94c64',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPassword;
