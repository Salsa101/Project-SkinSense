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
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import api from '../api';

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={150}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require('../../assets/OpsiAkun.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Sign Up</Text>

          <View style={styles.form}>
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

            <View style={styles.buttonContainer}>
              {errorMessage !== '' && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}
              <TouchableOpacity
                style={styles.signUpBtn}
                onPress={handleRegister}
              >
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
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF7F2',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#FCF7F2',
    paddingBottom: 10,
  },

  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 36,
    textAlign: 'center',
    marginTop: 60,
    fontFamily: 'Poppins-Bold',
    color: '#DE576F',
  },
  form: {
    marginHorizontal: 30,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  body: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginTop: 10,
    color: '#DE576F',
  },
  input: {
    borderWidth: 2.5,
    borderColor: '#DE576F',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 10,
  },
  signUpBtn: {
    backgroundColor: '#DE576F',
    paddingVertical: 5,
    paddingHorizontal: 130,
    borderRadius: 25,
    marginTop: 40,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3.5,
    elevation: 3,
  },
  signUpText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
  },
  signupText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#DE576F',
  },
  text2: {
    color: '#DE576F',
    fontFamily: 'Poppins-Bold',
  },
});

export default SignUp;
