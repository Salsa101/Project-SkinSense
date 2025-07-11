import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  SafeAreaView,
} from 'react-native';

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
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
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.body}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.body}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.body}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Konfirmasi password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <View style={{ marginTop: 30 }}>
            <Button
              style={styles.btn}
              title="Sign Up"
              onPress={() => navigation.navigate('Home')}
            />
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

export default SignUp;
