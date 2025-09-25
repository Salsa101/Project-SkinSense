import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';

import api from '../api';
import Navbar from '../Components/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome';

import { useExitAppHandler } from '../Handler/CustomBackHandler';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [active, setActive] = useState('Home');

  //Exit Handler
  useExitAppHandler();

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
      <ActivityIndicator
        style={{ flex: 1, justifyContent: 'center' }}
        size="large"
        color="#DE576F"
      />
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FCF7F2' }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcometext}>
              Hello,{' '}
              <Text style={styles.username}>{userData?.user?.username}</Text>
            </Text>
            <Text style={styles.skintypetext}>Dry Skin & Acne Prone</Text>
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
              • Product A is expiring in 4 days
            </Text>
            <Text style={styles.reminderText}>• Apply your sunscreen</Text>
          </View>
        </View>

        {/* Compare Button */}
        {/* <TouchableOpacity style={styles.compareButton}> */}
        <View style={styles.compareButtonContent}>
          <Text style={styles.compareButtonText}>Compare Your Skin</Text>
          <Icon
            name="arrow-right"
            size={15}
            color="#DE576F"
            style={styles.compareIcon}
          />
        </View>
        {/* </TouchableOpacity> */}

        {/* Ingredients Section */}
        <View style={styles.ingredientsSection}>
          <Text style={styles.ingredientsTitle}>Ingredients For You</Text>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productScrollContainer}>
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
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Assumenda debitis voluptas tempore, labore error molestias libero
              accusantium fuga nesciunt...
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <Navbar active={active} onPress={setActive} />
      </View>
    </View>
  );
};

const stylesProductScrollContainer = {
  paddingRight: 15,
  paddingBottom: 20,
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: 30,
    marginHorizontal: 15,
    marginBottom: 75,
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
    display: 'flex',
    backgroundColor: '#FFF0F3',
    borderRadius: 17,
    boxShadow: '0px 4px 4px rgba(151, 67, 67, 0.35)',
  },
  reminderContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reminderTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#DE576F',
    paddingHorizontal: 15,
  },
  reminderText: {
    fontFamily: 'Poppins-Light',
    fontSize: 12,
    color: '#DE576F',
    marginLeft: 15,
  },
  compareButtonContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5,
    boxShadow: '0px 4px 4px rgba(151, 67, 67, 0.35)',
    borderRadius: 20,
    backgroundColor: '#FFF0F3',
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  compareButton: {
    boxShadow: '0px 4px 4px rgba(151, 67, 67, 0.35)',
    borderRadius: 17,
    backgroundColor: '#FFF0F3',
    marginTop: 30,
  },
  compareButtonText: {
    color: '#DE576F',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  compareIcon: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
  },
  ingredientsSection: {
    marginTop: 30,
  },
  ingredientsTitle: {
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
    color: '#DE576F',
    fontSize: 16,
  },
  ingredientsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  ingredientsText: {
    backgroundColor: '#FFE1E2',
    fontFamily: 'Poppins-Light',
    color: '#DE576F',
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
  productTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#DE576F',
  },
  seeMore: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#EFB9C2',
  },
  productContainer: {
    flex: 1,
    backgroundColor: '#FFF0F3',
    boxShadow: '0px 4px 4px rgba(151, 67, 67, 0.35)',
    padding: 20,
    borderRadius: 20,
    marginTop: 15,
    marginRight: 15,
    marginBottom: 20,
  },
  productImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  productName: {
    fontFamily: 'Poppins-Light',
    fontSize: 16,
    color: '#DE576F',
  },
  ingredientProductContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  ingredientProductText: {
    backgroundColor: '#FFE1E2',
    fontFamily: 'Poppins-Light',
    color: '#DE576F',
    marginBottom: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  tipsSection: {
    marginTop: 40,
    marginBottom: 35,
  },
  tipsTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tipsContainer: {
    backgroundColor: '#FFF0F3',
    boxShadow: '0px 4px 12px rgba(227, 209, 212, 0.75)',
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
  },
  tipsTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#DE576F',
  },
  tipsName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#DE576F',
  },
  tipsText: {
    fontFamily: 'Poppins-Light',
    fontSize: 12,
    color: '#DE576F',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  welcometext: {
    fontSize: 28,
    fontFamily: 'Poppins-Regular',
    color: '#DE576F',
  },
  username: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#DE576F',
  },
  skintypetext: {
    marginTop: 0,
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#DE576F',
  },
});

export default HomeScreen;
