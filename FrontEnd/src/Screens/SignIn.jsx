import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import api from '../api';
import Icon from 'react-native-vector-icons/Ionicons';

const { height: windowHeight } = Dimensions.get('window');

const SignIn = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username && !password) {
      Alert.alert('Error', 'Username and password must be filled!');
      return;
    }

    if (!username) {
      Alert.alert('Error', 'Username must be filled!');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Password must be filled!');
      return;
    }

    setLoading(true);

    try {
      await api.post('/login', { username, password });

      const userResponse = await api.get('/user');
      const inOnBoard = userResponse.data?.inOnBoard || false;

      Alert.alert('Sukses', 'Login successfully.');

      if (!inOnBoard) {
        navigation.navigate('LandingPage');
      } else {
        navigation.navigate('Home');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login error.';
      Alert.alert('Error', msg);
      console.log('Login error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const estimatedFormHeight = 500;
  const imageHeight =
    windowHeight > estimatedFormHeight + 200
      ? windowHeight - estimatedFormHeight
      : windowHeight * 0.3;

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

          <View style={styles.formContainer}>
            <Text style={styles.title}>Sign In</Text>

            <Text style={styles.body}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan username"
              placeholderTextColor="#bf828dff"
              value={username}
              onChangeText={setUsername}
            />

            <Text style={styles.body}>Password</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[styles.input, { paddingRight: 40 }]}
                placeholder="Masukkan password"
                placeholderTextColor="#bf828dff"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={{ position: 'absolute', right: 10, top: 17 }}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#DE576F"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.textForgot}>Forgot Password?</Text>
            </TouchableOpacity>

            {errorMessage !== '' && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <TouchableOpacity
              style={[styles.signInBtn, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.signInText}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.signinText}>
              Don't have an account yet?{' '}
              <Text
                style={styles.text2}
                onPress={() => navigation.navigate('SignUp')}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </View>
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
  },
  innerContainer: {
    flex: 1,
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
    marginBottom: 20,
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
    marginTop: 16,
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
  signInBtn: {
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
  signInText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
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
