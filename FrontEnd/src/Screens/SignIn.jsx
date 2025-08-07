import { React, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import api from '../api';

const SignIn = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      await api.post('/login', {
        username,
        password,
      });

      Alert.alert('Sukses', 'Login berhasil.');
      navigation.navigate('Home');
    } catch (error) {
      const msg = error.response?.data?.message || 'Login gagal.';
      Alert.alert('Error', msg);
      console.log('Login error:', error.response?.data || error.message);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={80}
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
          <Text style={styles.title}>Sign In</Text>

          <View style={styles.form}>
            <Text style={styles.body}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan username"
              placeholderTextColor="#bf828dff"
              value={username}
              onChangeText={setUsername}
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

            <Text style={styles.textForgot}>Forgot Password?</Text>

            <View style={styles.buttonContainer}>
              {errorMessage !== '' && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}
              <TouchableOpacity style={styles.signInBtn} onPress={handleLogin}>
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
              <Text style={styles.signinText}>
                Already have an account?{' '}
                <Text
                  style={styles.text2}
                  onPress={() => navigation.navigate('SignUp')}
                >
                  Sign Up
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
    height: 350,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 36,
    textAlign: 'center',
    marginTop: 70,
    fontFamily: 'Poppins-Bold',
    color: '#DE576F',
  },
  form: {
    marginHorizontal: 30,
    marginTop: 25,
    justifyContent: 'space-between',
  },
  body: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginTop: 16,
    color: '#DE576F',
  },
  input: {
    borderWidth: 2.5,
    borderColor: '#DE576F',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 10,
  },
  signInBtn: {
    backgroundColor: '#DE576F',
    paddingVertical: 5,
    paddingHorizontal: 130,
    borderRadius: 25,
    marginTop: 50,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3.5,
    elevation: 3,
  },
  signInText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
  },
  signinText: {
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
  textForgot: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#DE576F',
  },
});

export default SignIn;
