import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';

import api from '../api';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/home', {
          withCredentials: true,
        });

        setUserData(response.data);
      } catch (err) {
        console.error(err);
        setError('Gagal mengambil data user. Silakan login kembali.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await api.post('/logout', {});

      Alert.alert('Sukses', 'Logout berhasil.');
      navigation.navigate('AccountOption');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Gagal logout.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text>Hello, {userData?.user?.username}</Text>
          <Text>Dry Skin & Acne Prone</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../../assets/profile-picture.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Reminder */}
      <View style={styles.reminderSection}>
        <Image
          source={require('../../assets/face-picture.png')}
          style={styles.faceImage}
        />
        <View style={styles.reminderContainer}>
          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>Reminder</Text>
            <Text style={styles.reminderTitle}>+</Text>
          </View>
          <Text style={styles.reminderText}>
            - Product A is expiring in 4 days
          </Text>
          <Text style={styles.reminderText}>- Apply your sunscreen</Text>
        </View>
      </View>

      {/* Compare Button */}
      <TouchableOpacity style={styles.compareButton}>
        <View style={styles.compareButtonContent}>
          <Text style={styles.compareButtonText}>Compare Your SKin</Text>
          <Text style={styles.compareButtonText}>---</Text>
        </View>
      </TouchableOpacity>

      {/* Ingredients Section */}
      <View style={styles.ingredientsSection}>
        <Text style={styles.ingredientsTitle}>Ingredients</Text>
        <View style={styles.ingredientsContainer}>
          <Text style={styles.ingredientsText}>Centella asiatica</Text>
          <Text style={styles.ingredientsText}>Ceramide NP</Text>
          <Text style={styles.ingredientsText}>Jojoba Oil</Text>
          <Text style={styles.ingredientsText}>BHA</Text>
          <Text style={styles.ingredientsText}>Hyaluronic Acid</Text>
        </View>
      </View>

      {/* Product Section */}
      <View style={styles.productSection}>
        <View style={styles.productTitleContainer}>
          <Text style={styles.productTitle}>Product For You</Text>
          <Text style={styles.seeMore}>See more</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Product 1 */}
          <View style={styles.productContainer}>
            <Image
              source={require('../../assets/product-image.png')}
              style={styles.productImage}
            />
            <Text style={styles.productName}>Somethinc Pure Retinol</Text>
            <View style={styles.ingredientProductContainer}>
              <Text style={styles.ingredientProductText}>BHA</Text>
              <Text style={styles.ingredientProductText}>Ceramide NP</Text>
            </View>
          </View>

          {/* Product 2 */}
          <View style={styles.productContainer}>
            <Image
              source={require('../../assets/product-image.png')}
              style={styles.productImage}
            />
            <Text style={styles.productName}>Somethinc Pure Retinol</Text>
            <View style={styles.ingredientProductContainer}>
              <Text style={styles.ingredientProductText}>BHA</Text>
              <Text style={styles.ingredientProductText}>Ceramide NP</Text>
            </View>
          </View>

          {/* Product 3 */}
          <View style={styles.productContainer}>
            <Image
              source={require('../../assets/product-image.png')}
              style={styles.productImage}
            />
            <Text style={styles.productName}>Somethinc Pure Retinol</Text>
            <View style={styles.ingredientProductContainer}>
              <Text style={styles.ingredientProductText}>BHA</Text>
              <Text style={styles.ingredientProductText}>Ceramide NP</Text>
            </View>
          </View>
        </ScrollView>
        <View></View>
      </View>

      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <View style={styles.tipsTitleContainer}>
          <Text style={styles.tipsTitle}>Tips For You</Text>
          <Text style={styles.seeMore}>See more</Text>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsName}>Lorem ipsum</Text>
          <Text style={styles.tipsText}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda
            debitis voluptas tempore, labore error molestias libero accusantium
            fuga nesciunt...
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    margin: 30,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reminderSection: {
    marginTop: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  faceImage: {
    display: 'flex',
  },
  reminderContainer: {
    backgroundColor: 'lightgray',
  },
  reminderContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compareButtonContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compareButton: {
    backgroundColor: 'lightgray',
    marginTop: 30,
  },
  ingredientsSection: {
    marginTop: 30,
  },
  ingredientsTitle: {
    marginBottom: 10,
  },
  ingredientsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  ingredientsText: {
    backgroundColor: 'magenta',
    marginBottom: 10,
    marginRight: 4,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  productTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  productContainer: {
    flex: 1,
    backgroundColor: 'pink',
    padding: 20,
    borderRadius: 20,
    marginTop: 15,
    marginRight: 15,
  },
  productImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  ingredientProductContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  ingredientProductText: {
    backgroundColor: 'magenta',
    marginBottom: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  tipsSection: {
    marginTop: 40,
  },
  tipsTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tipsContainer: {
    backgroundColor: 'pink',
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default HomeScreen;
