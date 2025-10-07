import { React, useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

import api from '../api';
import Navbar from '../Components/Navbar';

const ProfilePage = ({ navigation }) => {
  const [active, setActive] = useState('Profile');
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [dobDate, setDobDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openPicker, setOpenPicker] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/profile', { withCredentials: true });
      const data = response.data;

      setUsername(data.user.username);
      setFullname(data.user.full_name || '');
      setAge(data.user.age?.toString() || '');
      setDob(data.user.date_of_birth || '');
      if (data.user.date_of_birth) {
        setDobDate(new Date(data.user.date_of_birth));
      }
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
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
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
              <Icon name="camera" size={18} color="#FFFF" />
            </TouchableOpacity>
            <Text style={styles.nameText}>{username}</Text>
          </View>
        </View>

        <View style={styles.informationContainer}>
          <View style={styles.editProfileButtonContainer}>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={handlePress}
            >
              <Icon
                name={isEditing ? 'save' : 'edit'}
                size={20}
                color="white"
              />
              <Text style={styles.editProfileButtonText}>
                {isEditing ? 'Save' : 'Edit Profile'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 15, marginTop: 30 }}>
            {/* History Quiz Section */}
            <TouchableOpacity
              style={styles.bannerContainer}
              onPress={() => navigation.navigate('HistoryScan')}
              activeOpacity={0.8}
            >
              <Image
                source={require('../../assets/history-scan.jpg')}
                style={styles.bannerImage}
              />
              <View style={styles.bannerOverlay} />

              {/* Teks kiri atas */}
              <View style={styles.bannerTextWrapperTop}>
                <Text style={styles.bannerText}>History Scan</Text>
                <Text style={styles.bannerDesc}>
                  Learn more about how to do{'\n'}skincare properly
                </Text>
              </View>

              {/* Button "See Detail" kanan bawah */}
              <View style={styles.bannerBottomRight}>
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() => navigation.navigate('HistoryScan')}
                >
                  <Text style={styles.detailButtonText}>See Detail</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Navbar */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <Navbar active={active} onPress={setActive} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF7F2' },
  headerContainer: { position: 'relative', alignItems: 'center' },
  bannerImage: { width: '100%', height: 165 },
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
  profileImage: { width: '100%', height: '100%', borderRadius: 75 },
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
    fontSize: 20,
    color: '#DF8595',
  },
  informationContainer: { marginHorizontal: 30, marginTop: 120 },
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
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  profileText: { fontFamily: 'Poppins-Bold', fontSize: 16, color: '#DF8595' },
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
    fontSize: 16,
    color: '#A86C6E',
  },
  readOnly: {
    backgroundColor: '#FFF8F1',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#A86C6E',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 5,
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
  buttonStyleText: { fontFamily: 'Poppins-Bold', fontSize: 16, color: 'white' },
  bannerContainer: {
    position: 'relative',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 5,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 15,
  },
  // bannerOverlay: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: 'rgba(255, 255, 255, 0.3)',
  // },
  bannerTextWrapperTop: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
  },
  bannerText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
    textShadowColor: '#b34a5ece',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bannerDesc: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textShadowColor: '#b34a5ece',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bannerBottomRight: {
    position: 'absolute',
    bottom: 15,
    left: 15,
  },
  detailButton: {
    backgroundColor: '#f097a7ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  detailButtonText: {
    color: '#ffffffff',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
});

export default ProfilePage;
