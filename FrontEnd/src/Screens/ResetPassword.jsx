import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import api from '../api';
import Icon from 'react-native-vector-icons/Ionicons';

const ResetPassword = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.decorContainer}>
          <Image
            source={require('../../assets/resetpw.png')}
            style={styles.decorImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter the OTP code sent to your email and your new password.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="OTP Code"
          placeholderTextColor={'#000000'}
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
        />

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor={'#000000'}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Icon
              name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#E07C8E"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            placeholderTextColor={'#000000'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />

          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#E07C8E"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Mengirim...' : 'Reset Password'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 25,
  },
  decorContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  decorImage: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
    color: '#E07C8E',
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
    color: '#000000',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 5,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  button: {
    backgroundColor: '#E07C8E',
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
