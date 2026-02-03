import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const SkinGuide = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image */}
        <Image
          source={require('../../assets/facewash.png')}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Not sure what your skin type is?</Text>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Face wash test</Text>
          <View style={styles.line} />

          <Text style={styles.cardText}>
            To find out your skin type, wash your face with a gentle cleanser
            and pat it dry. Don’t apply any products, and wait about an hour.
            This lets your skin return to its natural condition for accurate
            results.
          </Text>
          <Text style={styles.cardText}>
            After one hour, check your face in a mirror and compare what you see
            to the descriptions on the previous page.
          </Text>
        </View>
      </ScrollView>

      {/* Button fixed di bawah */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back to Skin Quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7f5',
  },
  scrollContent: {
    alignItems: 'center',
    padding: 30,
  },
  image: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
   fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    color: '#d67c7c',
    marginTop: 20,
    marginBottom: 25,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f2a2a2',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
   fontFamily: 'Poppins-Bold',
    color: '#d67c7c',
    marginBottom: 10,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#f2a2a2',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#E68390',
    marginBottom: 10,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#f2a2a2',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
   fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
});

export default SkinGuide;
