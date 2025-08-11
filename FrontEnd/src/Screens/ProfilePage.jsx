import { React, useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

import api from '../api';

const ProfilePage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showPicker, setShowPicker] = useState(false);

  // GetProfile
  const fetchUserData = async () => {
    try {
      const response = await api.get('/profile', { withCredentials: true });
      const data = response.data;

      setUsername(data.user.username);
      setFullname(data.user.full_name || '');
      setAge(data.user.age?.toString() || '');
      setDob(data.user.date_of_birth || '');
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data user. Silakan login kembali.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // UpdateProfile
  const handlePress = async () => {
    if (isEditing) {
      try {
        await api.put(
          '/profile',
          {
            full_name: fullname,
            age: parseInt(age) || null,
            date_of_birth: dob,
          },
          { withCredentials: true },
        );

        await fetchUserData();
      } catch (error) {
        console.error('Gagal update profile:', error);
      }
    }
    setIsEditing(!isEditing);
  };

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

  // Date Picker
  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }
    setShowPicker(false);
    if (selectedDate) {
      const formattedForDB = dayjs(selectedDate).format('YYYY-MM-DD');
      setDob(formattedForDB);
    }
  };

  // Logout
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

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Konfirmasi',
      'Apakah kamu yakin ingin menghapus akun ini? Tindakan ini tidak bisa dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete('/profile', { withCredentials: true });

              Alert.alert('Sukses', 'Akun berhasil dihapus.');
              navigation.replace('AccountOption');
            } catch (error) {
              console.error('Gagal menghapus akun:', error);
              Alert.alert('Error', 'Gagal menghapus akun. Silakan coba lagi.');
            }
          },
        },
      ],
    );
  };

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

          <Text style={styles.nameText}>{username}</Text>
        </View>
      </View>

      <View style={styles.informationContainer}>
        {/* Edit / Save Button */}
        <View style={styles.editProfileButtonContainer}>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handlePress}
          >
            <Icon name={isEditing ? 'save' : 'edit'} size={25} color="white" />
            <Text style={styles.editProfileButtonText}>
              {isEditing ? 'Save' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Detail */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.profileText}>Full Name</Text>
          <TextInput
            style={[
              styles.profileTextInput,
              isEditing ? styles.editable : styles.readOnly,
            ]}
            value={fullname}
            onChangeText={setFullname}
            placeholder="Masukkan nama lengkap"
            editable={isEditing}
          />

          <Text style={styles.profileText}>Age</Text>
          <TextInput
            style={[
              styles.profileTextInput,
              isEditing ? styles.editable : styles.readOnly,
            ]}
            value={age}
            onChangeText={setAge}
            placeholder="Masukkan umur"
            editable={isEditing}
            keyboardType="numeric"
          />

          <Text style={styles.profileText}>Date of Birth</Text>
          <View
            style={[
              styles.profileTextInput,
              isEditing ? styles.editable : styles.readOnly,
              { flexDirection: 'row', alignItems: 'center' },
            ]}
          >
            <TextInput
              style={[
                isEditing ? styles.editable : styles.readOnly,
                { flex: 1, paddingVertical: 0 },
              ]}
              value={dob ? dayjs(dob).format('DD MMMM YYYY') : ''}
              placeholder="Masukkan tanggal lahir"
              editable={false}
              pointerEvents="none"
            />
            {isEditing && (
              <TouchableOpacity onPress={() => setShowPicker(true)}>
                <Icon name="calendar" size={24} color="#ED97A0" />
              </TouchableOpacity>
            )}
          </View>

          {/* Date Picker */}
          {showPicker && (
            <DateTimePicker
              value={dob ? new Date(dob) : new Date()}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          )}
        </View>
      </View>

      {/* Logout and Delete Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonStyle} onPress={handleLogout}>
          <Icon name="sign-out" size={25} color="white" />
          <Text style={styles.buttonStyleText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={handleDeleteAccount}>
          <Icon name="trash" size={25} color="white" />
          <Text style={styles.buttonStyleText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF7F2',
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
    borderColor: '#ED97A0',
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
    backgroundColor: '#ED97A0',
    borderRadius: 20,
    padding: 10,
  },
  nameText: {
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#DF8595',
  },
  informationContainer: {
    marginHorizontal: 30,
    marginTop: 120,
  },
  editProfileButtonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  editProfileButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFBCBF',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 25,
  },
  editProfileButtonText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  profileText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#DF8595',
  },
  profileTextInput: {
    borderWidth: 2,
    borderColor: '#ED97A0',
    paddingVertical: 7,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  editable: {
    backgroundColor: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#A86C6E',
  },
  readOnly: {
    backgroundColor: '#FFF8F1',
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#A86C6E',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 15,
    marginBottom: 70,
    marginHorizontal: 30,
  },
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFBCBF',
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonStyleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: 'white',
  },
});

export default ProfilePage;
