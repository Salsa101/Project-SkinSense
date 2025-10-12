import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EditProfile = ({ navigation }) => {
  const [name, setName] = useState('Rosa');
  const [email, setEmail] = useState('rosa123@gmail.com');
  const [age, setAge] = useState('20');
  const [dob, setDob] = useState('20 December 2004');
  const [profileImage, setProfileImage] = useState(
    require('../../assets/profile-pic.png'),
  );

  const handleSave = () => {
    console.log('Saved:', { name, email, age, dob });
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
              source={require('../../assets/banner-profile.png')}
              style={styles.bannerImage}
            />
            <TouchableOpacity style={styles.bannerOverlay}>
              <View style={styles.editButton}>
                <Icon name="camera-outline" size={30} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.profileImageContainer}>
            <Image source={profileImage} style={styles.profileImage} />
            <TouchableOpacity style={styles.overlay}>
              <View style={styles.editButton}>
                <Icon name="camera-outline" size={24} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput style={styles.input} value={dob} onChangeText={setDob} />
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
