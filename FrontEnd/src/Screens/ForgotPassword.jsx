import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
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

      Alert.alert('Success', res.data.message);

      navigation.navigate('ResetPassword', { email });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Gagal mengirim OTP reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email to receive a password reset link.
        </Text>

        <View style={styles.decorContainer}>
          <Image
            source={require('../../assets/phonepw.png')}
            style={styles.decorImage}
          />
        </View>

      <TextInput
        style={styles.input}
        placeholder="Masukkan Email"
        placeholderTextColor="#999"
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
          {loading ? 'Mengirim...' : 'Send Email Reset'}
        </Text>
      </TouchableOpacity>
      </ScrollView>
      
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 25,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#E07C8E',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 25,
  },
  decorImage: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    alignItems: 'center',
  },
  decorContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E07C8E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#E07C8E',
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
