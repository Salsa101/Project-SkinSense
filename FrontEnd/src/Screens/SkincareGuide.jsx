import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const stepsData = [
  {
    id: 1,
    title: 'Facewash',
    desc: 'Bersihkan wajah dengan facewash untuk menghilangkan kotoran dan minyak berlebih.',
    image: require('../../assets/step-facewash.png'),
  },
  {
    id: 2,
    title: 'Toner',
    desc: 'Gunakan toner untuk menyeimbangkan pH kulit dan melembabkan wajah.',
    image: require('../../assets/step-toner.png'),
  },
  {
    id: 3,
    title: 'Serum',
    desc: 'Aplikasikan serum sesuai kebutuhan kulit agar hasil lebih optimal.',
    image: require('../../assets/step-serum.png'),
  },
  {
    id: 4,
    title: 'Moisturizer',
    desc: 'Gunakan moisturizer untuk mengunci kelembaban kulit sepanjang hari.',
    image: require('../../assets/step-moisturizer.png'),
  },
  {
    id: 5,
    title: 'Sunscreen',
    desc: 'Lindungi kulit dari sinar matahari dengan sunscreen.',
    image: require('../../assets/step-sunscreen.png'),
  },
];

const SkincareGuide = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < stepsData.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = stepsData[currentStep];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={24} color="#d94c64" />
      </TouchableOpacity>

      {/* Step */}
      <View style={styles.content}>
        <Text style={styles.stepText}>Step {step.id}</Text>
        <Image source={step.image} style={styles.image} />
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.desc}>{step.desc}</Text>
      </View>

      {/* Indicator + Navigation */}
      <View style={styles.bottomControls}>
        <View style={styles.indicatorContainer}>
          {stepsData.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentStep === index && styles.activeDot]}
            />
          ))}
        </View>

        <View
          style={[
            styles.navButtons,
            currentStep === stepsData.length - 1 && { marginBottom: 30 }, // override marginBottom
          ]}
        >
          <TouchableOpacity
            onPress={handlePrev}
            disabled={currentStep === 0}
            style={[styles.navButton, currentStep === 0 && { opacity: 0.3 }]}
          >
            <Icon name="chevron-left" size={22} color="#d94c64" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            disabled={currentStep === stepsData.length - 1}
            style={[
              styles.navButton,
              currentStep === stepsData.length - 1 && { opacity: 0.3 },
            ]}
          >
            <Icon name="chevron-right" size={22} color="#d94c64" />
          </TouchableOpacity>
        </View>

        {currentStep === stepsData.length - 1 && (
          <TouchableOpacity
            style={styles.backNewsButton}
            onPress={() => navigation.navigate('News')}
          >
            <Text style={styles.backNewsText}>Back to news</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF4F6',
    alignItems: 'center',
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  stepText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#d94c64',
    marginBottom: 10,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#d94c64',
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: '#333',
    paddingHorizontal: 20,
  },
  bottomControls: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#d94c64',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.6,
    marginBottom: 50,
  },
  navButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  backNewsButton: {
    backgroundColor: '#d94c64',
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 3,
    marginBottom: 20,
    alignSelf: 'stretch',
    marginHorizontal: 30,
  },
  backNewsText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
});

export default SkincareGuide;
