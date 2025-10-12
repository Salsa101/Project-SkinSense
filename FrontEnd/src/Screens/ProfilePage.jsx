import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import api from '../api';
import Navbar from '../Components/Navbar';

const ProfilPage = ({ navigation }) => {
  const [isPushEnabled, setIsPushEnabled] = useState(true);
  const [active, setActive] = useState('Profile');

  const handleLogout = async () => {
    Alert.alert('Konfirmasi Logout', 'Yakin ingin logout?', [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.post('/logout', {});
            Alert.alert('Sukses', 'Logout berhasil.');
            navigation.navigate('AccountOption');
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Gagal logout.');
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Header */}
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
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Icon name="create-outline" size={18} color="#FFF" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.nameText}>Salsa</Text>
        <Text style={styles.emailText}>rosa@gmail.com</Text>

        {/* Menu */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('HistoryScan')}
          >
            <Icon name="scan-outline" size={22} color="#E07C8E" />
            <Text style={styles.menuText}>History Scan</Text>
            <Icon name="chevron-forward" size={20} color="#E07C8E" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="lock-closed-outline" size={22} color="#E07C8E" />
            <Text style={styles.menuText}>Change Password</Text>
            <Icon name="chevron-forward" size={20} color="#E07C8E" />
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <Icon name="notifications-outline" size={22} color="#E07C8E" />
            <Text style={styles.menuText}>Push Notification</Text>
            <Switch
              value={isPushEnabled}
              onValueChange={setIsPushEnabled}
              trackColor={{ false: '#ddd', true: '#F5C5CF' }}
              thumbColor={isPushEnabled ? '#E07C8E' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <Icon name="settings-outline" size={22} color="#E07C8E" />
            <Text style={styles.menuText}>Settings</Text>
            <Icon name="chevron-forward" size={20} color="#E07C8E" />
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
          >
            <Icon name="log-out-outline" size={22} color="#E07C8E" />
            <Text style={[styles.menuText, { color: '#E07C8E' }]}>Logout</Text>
            <Icon name="chevron-forward" size={20} color="#E07C8E" />
          </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#FFF6F8' },
  headerContainer: { position: 'relative', alignItems: 'center' },
  bannerImage: { width: '100%', height: 150, resizeMode: 'cover' },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50,
    left: 30,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#ED97A0',
    width: 100,
    height: 100,
  },
  profileImage: { width: '100%', height: '100%', borderRadius: 75 },
  nameText: {
    textAlign: 'left',
    marginTop: 60,
    marginLeft: 30,
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#DF8595',
  },
  emailText: {
    textAlign: 'left',
    marginLeft: 30,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#B5838D',
  },
  header: {
    backgroundColor: '#FAD4D8',
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backIcon: { position: 'absolute', left: 20, top: 20 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: { fontSize: 20, fontWeight: '600', color: '#E07C8E' },
  email: { color: '#b87c8c', marginBottom: 10 },
  editButton: {
    backgroundColor: '#E07C8E',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editText: { color: '#fff', fontWeight: '500' },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2D8DC',
    justifyContent: 'space-between',
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 15,
    color: '#E07C8E',
  },
  logoutContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  editProfileButton: {
    position: 'absolute',
    bottom: -55,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E07C8E',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 2,
  },
  editProfileText: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    marginLeft: 6,
  },
});

export default ProfilPage;
