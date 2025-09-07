import { React } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { useExitAppHandler } from '../Handler/CustomBackHandler';

const AccountOption = ({ navigation }) => {
  //Handler Exit app
  useExitAppHandler();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/OpsiAkun.png')}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={{ marginBottom: 50, alignItems: 'center' }}>
          <Text style={styles.title}>Hello!</Text>
          <Text style={styles.subtitle}>Welcome to SkinSense</Text>
        </View>

        <TouchableOpacity
          style={styles.signInBtn}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpBtn}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF7F2',
  },
  image: {
    width: '100%',
    height: '45%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    color: '#DE576F',
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Medium',
    color: '#DE576F',
    marginBottom: 30,
    lineHeight: 15,
  },
  signInBtn: {
    backgroundColor: '#DE576F',
    paddingVertical: 8,
    paddingHorizontal: 130,
    borderRadius: 25,
    marginBottom: 20,
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
  },
  signUpBtn: {
    borderColor: '#DE576F',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    paddingVertical: 5,
    paddingHorizontal: 120,
    borderRadius: 25,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3.5,
    elevation: 3,
  },
  signUpText: {
    color: '#DE576F',
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
  },
});

export default AccountOption;
