import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../api';

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Password baru tidak cocok!');
      return;
    }

    setLoading(true);

    try {
      const res = await api.put('/change-password', {
        currentPassword,
        newPassword,
      });
      Alert.alert('Sukses', res.data.message || 'Password berhasil diubah!');
      navigation.goBack();
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Gagal mengubah password. Coba lagi.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFF6F8' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-outline" size={24} color="#E07C8E" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Change Password</Text>
          </View>

          {/* Gambar */}
          <View style={styles.decorContainer}>
            <Image
              source={require('../../assets/img-change-pass.png')}
              style={styles.decorImage}
            />
          </View>

          <View style={styles.formContainer}>
            {/* Current Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter current password"
                placeholderTextColor={'#B1495C'}
                secureTextEntry={!showCurrent}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowCurrent(!showCurrent)}
              >
                <Icon
                  name={showCurrent ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#E07C8E"
                />
              </TouchableOpacity>
            </View>

            {/* New Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor={'#B1495C'}
                secureTextEntry={!showNew}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNew(!showNew)}
              >
                <Icon
                  name={showNew ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#E07C8E"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm New Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter confirm password"
                placeholderTextColor={'#B1495C'}
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirm(!showConfirm)}
              >
                <Icon
                  name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#E07C8E"
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Tombol Save tetap di bawah */}
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, loading && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20 },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E07C8E',
    marginLeft: 15,
  },
  decorContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  decorImage: {
    width: 280,
    height: 280,
  },
  formContainer: { marginBottom: 20 },
  inputWrapper: { position: 'relative', marginBottom: 15 },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E07C8E',
    marginBottom: 5, // space antara label dan TextInput
  },

  input: {
    borderWidth: 1,
    borderColor: '#E07C8E',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#333',
    paddingRight: 40,
  },
  eyeIcon: { position: 'absolute', right: 12, top: 35 },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  saveButton: {
    backgroundColor: '#E07C8E',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default ChangePassword;
