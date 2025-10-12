import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import api from '../api';

const { height: windowHeight } = Dimensions.get('window');

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formHeight, setFormHeight] = useState(0);

  const handleRegister = async () => {
    try {
      const response = await api.post('/register', {
        username,
        email,
        password,
        confirmPassword,
      });

      if (response.data.message === 'User berhasil terdaftar.') {
        Alert.alert('Sukses', 'Berhasil daftar! Silakan login.');
        navigation.navigate('SignIn');
      } else {
        Alert.alert('Gagal', response.data.message || 'Gagal mendaftar.');
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || 'Terjadi kesalahan saat registrasi.';
      Alert.alert('Error', msg);
      console.log('Register error:', error.response?.data || error.message);
    }
  };

  // Tinggi gambar otomatis menyesuaikan sisa layar
  const imageHeight = windowHeight - formHeight;

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Image
            source={require('../../assets/OpsiAkun.png')}
            style={[styles.image, { height: imageHeight }]}
          />

          <View
            style={styles.formContainer}
            onLayout={(event) => setFormHeight(event.nativeEvent.layout.height)}
          >
            <Text style={styles.title}>Sign Up</Text>

            <Text style={styles.body}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan username"
              placeholderTextColor="#bf828dff"
              value={username}
              onChangeText={setUsername}
            />

            <Text style={styles.body}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan email"
              placeholderTextColor="#bf828dff"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Text style={styles.body}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password"
              placeholderTextColor="#bf828dff"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={styles.body}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Konfirmasi password"
              placeholderTextColor="#bf828dff"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            {errorMessage !== '' && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <TouchableOpacity style={styles.signUpBtn} onPress={handleRegister}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.signupText}>
              Already have an account?{' '}
              <Text
                style={styles.text2}
                onPress={() => navigation.navigate('SignIn')}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF7F2' },
  scrollContainer: { flexGrow: 1 },
  innerContainer: { flex: 1 },
  image: { width: '100%', resizeMode: 'cover' },
  formContainer: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 30,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
    fontFamily: 'Poppins-Bold',
    color: '#DE576F',
  },
  body: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginTop: 5,
    color: '#DE576F',
  },
  input: {
    borderWidth: 2.5,
    borderColor: '#DE576F',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
    color: '#333',
  },
  signUpBtn: {
    backgroundColor: '#DE576F',
    paddingVertical: 5,
    borderRadius: 25,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3.5,
    elevation: 3,
  },
  signUpText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  errorText: { color: 'red', marginTop: 5 },
  signupText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#DE576F',
  },
  text2: { color: '#DE576F', fontFamily: 'Poppins-Bold' },
});

export default SignUp;
