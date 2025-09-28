import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const LandingPage = ({navigation}) => {
  return (
    <LinearGradient
      colors={['#DF8595', '#F8C8D1']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Bagian Gambar */}
        <Image
          source={require('../../assets/landing-image.png')}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Bagian Text & Button */}
        <View style={styles.content}>
          <Text style={styles.title}>Skin Analysis</Text>
          <Text style={styles.subtitle}>Ready to glow?</Text>
          <Text style={styles.description}>
            Start with a quick quiz and face scan to uncover what your skin
            truly needs!
          </Text>

          <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('SkinQuiz')}}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 600,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
    marginBottom: 60,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#f28cab',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LandingPage;
