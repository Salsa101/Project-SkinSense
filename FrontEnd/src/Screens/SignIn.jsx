import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';

const SignIn = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    axios
      .post('http://10.0.2.2:3000/login', {
        username: username,
        password: password,
      })
      .then(response => {
        if (response.data.success) {
          setErrorMessage('');
          navigation.navigate('Home');
        } else {
          setErrorMessage('Data yang anda masukkan salah');
          setTimeout(() => setErrorMessage(''), 3000);
        }
      })
      .catch(error => {
        setErrorMessage('Data yang anda masukkan salah');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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

          <View style={{ marginTop: 10 }}>
            {errorMessage !== '' && (
              <Text style={{ color: 'red', }}>
                {errorMessage}
              </Text>
            )}
            <Button style={styles.btn} title="Sign In" onPress={handleLogin} />
            <Text style={{ textAlign: 'center', marginTop: 10 }}>
              Already have an account? {''}
              <Text
                style={styles.text2}
                onPress={() => navigation.navigate('SignIn')}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </View>
        <View />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  image: {
    width: '100%',
    height: '35%',
    resizeMode: 'cover',
  },
  form: {
    margin: 30,
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    paddingTop: 30,
    paddingBottom: 10,
    fontWeight: 'bold',
    color: '#0077b6',
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
  btn: {
    borderRadius: 6,
  },
  text2: {
    color: '#0077b6',
    fontWeight: 'bold',
  },
});

export default SignIn;
