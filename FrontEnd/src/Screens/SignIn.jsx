import { React, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
  Image,
  Alert,
} from 'react-native';

import api from '../api';

const SignIn = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      await api.post(
        '/login',
        {
          username,
          password,
        },
      );

      Alert.alert('Sukses', 'Login berhasil.');
      navigation.navigate('Home');
    } catch (error) {
      const msg = error.response?.data?.message || 'Login gagal.';
      Alert.alert('Error', msg);
      console.log('Login error:', error.response?.data || error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
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
              value={username}
              onChangeText={setUsername}
            />

            <Text style={styles.body}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={styles.buttonContainer}>
              {errorMessage !== '' && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}
              <Button title="Sign In" onPress={handleLogin} />
              <Text style={styles.signupText}>
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
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  image: {
    width: '100%',
    height: '35%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    paddingTop: 30,
    paddingBottom: 10,
    fontWeight: 'bold',
    color: '#0077b6',
  },
  form: {
    margin: 30,
  },
  body: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
  },
  signupText: {
    textAlign: 'center',
    marginTop: 10,
  },
  text2: {
    color: '#0077b6',
    fontWeight: 'bold',
  },
});

export default SignIn;
