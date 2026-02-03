import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const StepRoutine = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/step-routine-img.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Icon name="arrow-left" size={24} color="#ff5a77" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Basic Skincare Steps</Text>

          {/* Start Button */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('SkincareGuide')}
            activeOpacity={0.8}
          >
            <Text style={styles.startText}>Start</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECECE7',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 20,
    width: 38,
    height: 38,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 100,
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: '#d94c64',
  },
  startButton: {
    marginBottom: 40,
    alignSelf: 'stretch',
    marginHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#d94c64',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  startText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#d94c64',
  },
});

export default StepRoutine;
