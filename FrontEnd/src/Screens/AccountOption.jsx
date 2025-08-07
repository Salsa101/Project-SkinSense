import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const AccountOption = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/OpsiAkun.png')}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={{ marginBottom:30, alignItems: 'center' }}>
          <Text style={styles.title}>Hello!</Text>
          <Text style={styles.subtitle}>Welcome to SkinSense</Text>
        </View>

        <TouchableOpacity style={styles.signInBtn}>
          <Text
            style={styles.signInText}
            onPress={() => navigation.navigate('SignIn')}
          >
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpBtn}>
          <Text
            style={styles.signUpText}
            onPress={() => navigation.navigate('SignUp')}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7EBE0',
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
    fontSize: 40,
    fontWeight: 'bold',
    color: '#D25E8D',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 30,
  },
  signInBtn: {
    backgroundColor: '#F58CAB',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 15,
  },
  signInText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signUpBtn: {
    borderColor: '#F58CAB',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  signUpText: {
    color: '#F58CAB',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AccountOption;
