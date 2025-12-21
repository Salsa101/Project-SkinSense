import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { launchImageLibrary } from 'react-native-image-picker';
import api from '../api';

const EditProfile = ({ navigation }) => {
  const [name, setName] = useState('Rosa');
  const [email, setEmail] = useState('rosa123@gmail.com');
  const [age, setAge] = useState('20');
  const [dob, setDob] = useState('20 December 2004');
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const [isPickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/view');
        const user = res.data.user;

        setName(user.username || '');
        setEmail(user.email || '');
        setAge(user.age ? String(user.age) : '');
        setDob(user.date_of_birth || '');

        if (user.profileImage) {
          setProfileImage({
            uri: `${api.defaults.baseURL}${user.profileImage}`,
            name: 'profile.jpg',
            type: 'image/jpeg',
          });
        }
        if (user.bannerImage) {
          setBannerImage({
            uri: `${api.defaults.baseURL}${user.bannerImage}`,
            name: 'banner.jpg',
            type: 'image/jpeg',
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        Alert.alert('Error', 'Failed to load profile data.');
      }
    };

    fetchProfile();
  }, []);

  const pickImage = setter => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && response.assets?.length > 0) {
        const asset = response.assets[0];
        setter({
          uri: asset.uri,
          name: asset.fileName || 'image.jpg',
          type: asset.type || 'image/jpeg',
        });
      }
    });
  };

  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);
  const handleConfirm = date => {
    const formattedDate = date.toISOString().split('T')[0];
    setDob(formattedDate);

    const today = new Date();
    let ageCalc = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      ageCalc--;
    }
    setAge(String(ageCalc));

    hidePicker();
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('username', name);
      formData.append('age', age);
      formData.append('date_of_birth', dob);
      formData.append('email', email);
      if (profileImage) {
        formData.append('profileImage', {
          uri: profileImage.uri,
          name: profileImage.name || 'profile.jpg',
          type: profileImage.type || 'image/jpeg',
        });
      }

      if (bannerImage) {
        formData.append('bannerImage', {
          uri: bannerImage.uri,
          name: bannerImage.name || 'banner.jpg',
          type: bannerImage.type || 'image/jpeg',
        });
      }

      const res = await api.put('/profile/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.navigate('Profile');
    } catch (err) {
      console.error('Failed to update profile:', err);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={22} color="#E07C8E" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.save}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Banner + Profile Image */}
        <View style={styles.headerContainer}>
          <View style={styles.bannerWrapper}>
            <Image
              source={
                bannerImage
                  ? { uri: bannerImage.uri }
                  : require('../../assets/banner-profile.png')
              }
              style={styles.bannerImage}
            />
            <TouchableOpacity
              style={styles.bannerOverlay}
              onPress={() => pickImage(setBannerImage)}
            >
              <View style={styles.editButton}>
                <Icon name="camera-outline" size={30} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.profileImageContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage.uri }
                  : require('../../assets/profile-pic.png')
              }
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.overlay}
              onPress={() => pickImage(setProfileImage)}
            >
              <View style={styles.editButton}>
                <Icon name="camera-outline" size={24} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <View>
            <Text style={styles.label}>Date of Birth</Text>

            <TouchableOpacity onPress={showPicker} activeOpacity={0.8}>
              <View
                style={[
                  styles.input,
                  { flexDirection: 'row', alignItems: 'center' },
                ]}
              >
                <Text style={{ flex: 1, color: dob ? '#000' : '#888' }}>
                  {dob || 'Select your date of birth'}
                </Text>
                <Icon name="calendar-outline" size={24} color="#E07C8E" />
              </View>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isPickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hidePicker}
            />
          </View>

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6F7',
  },
  scroll: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: '#E07C8E',
    fontWeight: '500',
  },
  save: {
    fontSize: 16,
    color: '#E07C8E',
    fontWeight: '600',
  },
  headerContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 60,
  },
  bannerImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50,
    left: 30,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#ED97A0',
    width: 100,
    height: 100,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    borderRadius: 25,
    padding: 8,
  },
  bannerWrapper: {
    position: 'relative',
    width: '100%',
    height: 140,
  },

  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    paddingHorizontal: 25,
    marginTop: 10,
  },
  label: {
    color: '#E07C8E',
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E07C8E',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff',
  },
});

export default EditProfile;
