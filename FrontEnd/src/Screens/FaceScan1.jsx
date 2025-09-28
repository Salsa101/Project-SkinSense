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

import Icon from 'react-native-vector-icons/Ionicons';

const FaceScan = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.title}>Face Scan</Text>

        {/* Image */}
        <Image
          source={require('../../assets/facescan.png')}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tips before face scan</Text>
          <View style={styles.line} />

          <Text style={styles.cardSubText}>Use Natural Lighting</Text>
          <Text style={styles.cardText}>
            Avoid shadows or dim rooms for a clearer scan result.
          </Text>

          <Text style={styles.cardSubText}>Clean Bare Face</Text>
          <Text style={styles.cardText}>
            Remove makeup or skincare products before scanning.
          </Text>

          <Text style={styles.cardSubText}>Stay Still and Centered</Text>
          <Text style={styles.cardText}>
            Hold your phone at eye level and keep a neutral expression.
          </Text>
        </View>

        <View style={styles.warning}>
          <Icon name="alert-circle" size={18} color="#d67c7c" />
          <Text style={styles.warningText}>
            Note: This scan currently detects acne only. More skin features will
            be available soon!
          </Text>
        </View>
      </ScrollView>

      {/* Button fixed di bawah */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('FaceScan2')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
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
    width: width * 0.6,
    height: width * 0.6,
    marginLeft: -45,
  },
  title: {
    fontSize: 24,
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
    marginBottom: 5,
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
  cardSubText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#d67c7c',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#444',
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
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    padding: 10,
  },
  warningText: {
    marginLeft: 5,
    fontFamily: 'Poppins-Regular',
  },
});

export default FaceScan;
