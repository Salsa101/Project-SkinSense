import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfilePage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/banner-profile.png')}
          style={styles.bannerImage}
        />

        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../assets/profile-pic.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraIconContainer}>
            <Icon name="camera" size={20} color="#FFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 165,
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -60,
    left: 30,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: 'pink',
    width: 120,
    height: 120,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: -8,
    right: -4,
    backgroundColor: 'pink',
    borderRadius: 20,
    padding: 10,
  },
});

export default ProfilePage;
