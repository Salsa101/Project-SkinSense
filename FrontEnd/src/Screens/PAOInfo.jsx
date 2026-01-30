import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const PAOInfo = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>What is PAO?</Text>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/pao-info.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View>
          <Text style={styles.subtitle}>PAO (Period After Opening)</Text>
          <Text style={styles.description}>
            A symbol that indicates how long a skincare or makeup product is
            safe to use after opening{'\n'}
            It's usually marked with an image of an open jar and a number like
            "6M" or "12M"
          </Text>

          <View style={styles.divider} />

          <Text style={styles.example}>
            <Text style={{ fontFamily: 'Poppins-SemiBold' }}>Example:</Text> “6M” means the
            product should be used within 6 months of opening.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to Edit Product</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F7',
  },
  scrollContent: {
    alignItems: 'center',
    padding: 30,
    paddingBottom: 120,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#E07C8E',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F4C7C7',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#E07C8E',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#555',
    lineHeight: 22,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#E9B7B7',
    marginVertical: 15,
  },
  example: {
    fontSize: 13,
    fontFamily: 'Poppins-Italic',
    color: '#E07C8E',
    fontStyle: 'italic',
  },
  button: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    backgroundColor: '#E07C8E',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonText: {
    color: '#FFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
  },
});

export default PAOInfo;
