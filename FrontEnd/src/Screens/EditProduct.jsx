import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import api from '../api';
import { launchImageLibrary } from 'react-native-image-picker';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';

const EditProduct = ({ route, navigation }) => {
  const { id } = route.params; // id product dikirim saat navigate
  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productStep, setProductStep] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Product Type
  const [openProduct, setOpenProduct] = useState(false);
  const [productValue, setProductValue] = useState(null);
  const [productItems, setProductItems] = useState([
    { label: 'Cleanser', value: 'cleanser' },
    { label: 'Toner', value: 'toner' },
    { label: 'Serum', value: 'serum' },
    { label: 'Moisturizer', value: 'moisturizer' },
    { label: 'Mask', value: 'mask' },
  ]);

  //Routine Type
  const [openRoutine, setOpenRoutine] = useState(false);
  const [routineValue, setRoutineValue] = useState(null);
  const [routineItems, setRoutineItems] = useState([
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Custom', value: 'custom' },
  ]);

  //Routine Day
  const [openRoutineDay, setOpenRoutineDay] = useState(false);
  const [routineValueDay, setRoutineValueDay] = useState([]);
  const [routineItemsDay, setRoutineItemsDay] = useState([
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday', value: 'sunday' },
  ]);

  // Custom date
  const [customDate, setCustomDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  //Time of Day
  const [openTimeDay, setOpenTimeDay] = useState(false);
  const [timeDayValue, setTimeDayValue] = useState(null);
  const [timeDayItems, setTimeDayItems] = useState([
    { label: 'Morning', value: 'morning' },
    { label: 'Night', value: 'night' },
  ]);

  const [openDateOpened, setOpenDateOpened] = useState(false);
  const [openExpiration, setOpenExpiration] = useState(false);
  const [dateOpened, setDateOpened] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);

  const [openTime, setOpenTime] = useState(false);
  const [time, setTime] = useState(null);

  const [isVerified, setIsVerified] = useState(false);

  const handleRoutineChange = callback => value => {
    setRoutineValue(value);

    if (value === 'weekly') {
      setCustomDate(null);
    } else if (value === 'custom') {
      setRoutineValueDay([]);
    } else {
      setRoutineValueDay([]);
      setCustomDate(null);
    }

    if (callback) callback(value);
  };

  // GET product saat buka halaman
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/routine-products/${id}`);
        const p = res.data;

        if (p.Product) {
          setIsVerified(p.Product.isVerified);
          setProductName(p.Product.productName);
          setProductBrand(p.Product.productBrand);
          setProductStep(p.productStep);
          setProductValue(p.Product.productType || null);
          setRoutineValue(p.routineType || null);
          setRoutineValueDay(p.routineDay || []);
          setCustomDate(p.customDate ? new Date(p.customDate) : null);
          setTimeDayValue(p.timeOfDay || null);
          setRoutineValueDay(p.dayOfWeek || null);
          setDateOpened(p.dateOpened ? new Date(p.dateOpened) : null);
          setExpirationDate(
            p.expirationDate ? new Date(p.expirationDate) : null,
          );
          setTime(
            p.reminderTime ? new Date(`1970-01-01T${p.reminderTime}`) : null,
          );

          if (p.Product.productImage) {
            setImageUri(`http://10.0.2.2:3000${p.Product.productImage}`);
          }
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Gagal ambil data produk');
      }
    };
    fetchProduct();
  }, [id]);

  // upload gambar
  const handleUpload = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        const file = response.assets[0];
        setImageUri(file.uri);
        setSelectedFile({
          uri: file.uri,
          type: file.type,
          name: file.fileName,
        });
      }
    });
  };

  // UPDATE product
  const handleUpdate = async () => {
    try {
      const payload = new FormData();
      payload.append('productName', productName);
      payload.append('productBrand', productBrand);
      payload.append('productStep', productStep);
      payload.append('productType', productValue);
      if (selectedFile) {
        payload.append('productImage', selectedFile);
      }

      // kolom RoutineProduct
      payload.append('routineType', routineValue);
      payload.append('routineDay', JSON.stringify(routineValueDay)); // array harus di-serialize
      if (customDate) payload.append('customDate', customDate.toISOString());
      if (timeDayValue) payload.append('timeOfDay', timeDayValue);
      if (dateOpened) payload.append('dateOpened', dateOpened.toISOString());
      if (expirationDate)
        payload.append('expirationDate', expirationDate.toISOString());
      if (time) {
        // hanya jam-menit
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        payload.append('reminderTime', `${hours}:${minutes}`);
      }

      const res = await api.put(`/routine-products/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Produk berhasil diupdate', [
        { text: 'OK', onPress: () => navigation.navigate('EditRoutine') },
      ]);
      console.log('Updated:', res.data);
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Gagal update produk',
      );
    }
  };

  const validateTime = (time, timeDay) => {
    if (!time) return true;

    const hour = time.getHours();

    if (timeDay === 'morning') {
      // 05:00 - 11:59
      return hour >= 5 && hour < 12;
    }

    if (timeDay === 'night') {
      // 18:00 - 23:59
      return hour >= 18 && hour < 24;
    }

    return true;
  };

  const handleSetTime = selectedTime => {
    if (!validateTime(selectedTime, timeDayValue)) {
      Alert.alert(
        'Invalid Time',
        `Reminder time doesn't match with ${timeDayValue} schedule`,
      );
      setOpenTime(false); // <- tutup modal walau invalid
      return;
    }
    setTime(selectedTime);
    setOpenTime(false); // <- tutup modal kalau valid juga
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Edit Product</Text>
        <View style={styles.formContainer}>
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <TouchableOpacity
              style={styles.box}
              onPress={handleUpload}
              disabled={isVerified}
            >
              {imageUri ? (
                <Image
                  source={
                    imageUri.startsWith('http')
                      ? { uri: imageUri } // kalau dari database
                      : { uri: imageUri } // kalau dari local
                  }
                  style={{ width: 120, height: 120, borderRadius: 12 }}
                />
              ) : (
                <Icon1 name="plus" size={80} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <Text
              style={{
                alignSelf: 'center',
                marginTop: 5,
                fontFamily: 'Poppins-Medium',
                color: '#E07C8E',
              }}
            >
              Product Image
            </Text>
          </View>

          {/* Product Name */}
          <View style={styles.inputFormContainer}>
            <View style={styles.form}>
              <Text style={styles.formText}>Product Name</Text>
              <View
                style={[
                  styles.inputContainer,
                  isVerified && styles.disabledField,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Type here..."
                  placeholderTextColor="#E07C8E"
                  value={productName}
                  onChangeText={setProductName}
                  editable={!isVerified}
                />
              </View>
            </View>

            {/* Product Brand */}
            <View style={styles.form}>
              <Text style={styles.formText}>Product Brand</Text>
              <View
                style={[
                  styles.inputContainer,
                  isVerified && styles.disabledField,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Type here..."
                  placeholderTextColor="#E07C8E"
                  value={productBrand}
                  onChangeText={setProductBrand}
                  editable={!isVerified}
                />
              </View>
            </View>

            {/* Step */}
            <View style={styles.form}>
              <Text style={styles.formText}>Step</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product step number..."
                  placeholderTextColor="#E07C8E"
                  keyboardType="numeric"
                  value={productStep}
                  onChangeText={text => {
                    const number = text.replace(/[^0-9]/g, '');
                    setProductStep(number);
                  }}
                />
              </View>
            </View>

            {/* Product Type */}
            <View style={[styles.form, { zIndex: 100 }]}>
              <Text style={styles.formText}>Product Type</Text>
              <DropDownPicker
                open={openProduct}
                value={productValue}
                items={productItems}
                setOpen={setOpenProduct}
                setValue={setProductValue}
                setItems={setProductItems}
                disabled={isVerified}
                placeholder="Select product type"
                placeholderStyle={{
                  color: '#E07C8E',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                }}
                textStyle={{
                  fontFamily: 'Poppins-Medium',
                  color: '#E07C8E',
                  fontSize: 12,
                }}
                style={[
                  styles.dropdownPicker,
                  isVerified && styles.disabledField,
                ]}
                dropDownContainerStyle={styles.dropdownStyle}
                ArrowDownIconComponent={() => (
                  <Icon name="chevron-down" size={20} color="#E07C8E" />
                )}
                ArrowUpIconComponent={() => (
                  <Icon name="chevron-up" size={20} color="#E07C8E" />
                )}
              />
            </View>

            {/* Routine Type */}
            <View style={[styles.form, { zIndex: 99 }]}>
              <Text style={styles.formText}>Routine Type</Text>
              <DropDownPicker
                open={openRoutine}
                value={routineValue}
                items={routineItems}
                setOpen={setOpenRoutine}
                setValue={handleRoutineChange(setRoutineValue)}
                setItems={setRoutineItems}
                placeholder="Select routine type"
                placeholderStyle={{
                  color: '#E07C8E',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                }}
                textStyle={{
                  fontFamily: 'Poppins-Medium',
                  color: '#E07C8E',
                  fontSize: 12,
                }}
                style={styles.dropdownPicker}
                dropDownContainerStyle={styles.dropdownStyle}
                ArrowDownIconComponent={() => (
                  <Icon name="chevron-down" size={20} color="#E07C8E" />
                )}
                ArrowUpIconComponent={() => (
                  <Icon name="chevron-up" size={20} color="#E07C8E" />
                )}
              />
            </View>

            {/* Weekly: Routine Day */}
            {routineValue === 'weekly' && (
              <View style={[styles.form, { zIndex: 98 }]}>
                <Text style={styles.formText}>Routine Day</Text>
                <DropDownPicker
                  multiple={true}
                  min={0}
                  max={7}
                  open={openRoutineDay}
                  value={routineValueDay}
                  items={routineItemsDay}
                  setOpen={setOpenRoutineDay}
                  setValue={setRoutineValueDay}
                  setItems={setRoutineItemsDay}
                  placeholder="Select days"
                  placeholderStyle={{
                    color: '#E07C8E',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                  }}
                  textStyle={{
                    fontFamily: 'Poppins-Medium',
                    color: '#E07C8E',
                    fontSize: 12,
                  }}
                  style={styles.dropdownPicker}
                  dropDownContainerStyle={[
                    styles.dropdownStyle,
                    { maxHeight: 800 },
                  ]}
                  ArrowDownIconComponent={() => (
                    <Icon name="chevron-down" size={20} color="#E07C8E" />
                  )}
                  ArrowUpIconComponent={() => (
                    <Icon name="chevron-up" size={20} color="#E07C8E" />
                  )}
                />
              </View>
            )}

            {/* Custom: pilih tanggal sekali */}
            {routineValue === 'custom' && (
              <View style={styles.form}>
                <Text style={styles.formText}>Custom Date</Text>
                <View
                  style={[
                    styles.inputContainer,
                    { paddingVertical: 13, paddingLeft: 20 },
                  ]}
                >
                  <Text style={styles.input}>
                    {customDate
                      ? customDate.toLocaleDateString()
                      : 'Pick a date'}
                  </Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Icon
                      name="calendar"
                      size={20}
                      color="#E07C8E"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Time of Day */}
            <View style={[styles.form, { zIndex: 97 }]}>
              <Text style={styles.formText}>Time of Day</Text>
              <DropDownPicker
                open={openTimeDay}
                value={timeDayValue}
                items={timeDayItems}
                setOpen={setOpenTimeDay}
                setValue={setTimeDayValue}
                setItems={setTimeDayItems}
                placeholder="Select time of day"
                placeholderStyle={{
                  color: '#E07C8E',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                }}
                textStyle={{
                  fontFamily: 'Poppins-Medium',
                  color: '#E07C8E',
                  fontSize: 12,
                }}
                style={styles.dropdownPicker}
                dropDownContainerStyle={styles.dropdownStyle}
                ArrowDownIconComponent={() => (
                  <Icon name="chevron-down" size={20} color="#E07C8E" />
                )}
                ArrowUpIconComponent={() => (
                  <Icon name="chevron-up" size={20} color="#E07C8E" />
                )}
              />
            </View>

            {/* Date Opened */}
            <View style={styles.form}>
              <Text style={styles.formText}>Date Opened</Text>
              <View
                style={[
                  styles.inputContainer,
                  { paddingVertical: 13, paddingLeft: 20 },
                ]}
              >
                <Text style={styles.input}>
                  {dateOpened
                    ? dateOpened.toLocaleDateString()
                    : 'Please select open date'}
                </Text>

                <TouchableOpacity onPress={() => setOpenDateOpened(true)}>
                  <Icon
                    name="calendar"
                    size={20}
                    color="#E07C8E"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Expiration Date */}
            <View style={styles.form}>
              <Text style={styles.formText}>Expiration Date</Text>
              <View
                style={[
                  styles.inputContainer,
                  { paddingVertical: 13, paddingLeft: 20 },
                ]}
              >
                <Text style={styles.input}>
                  {expirationDate
                    ? expirationDate.toLocaleDateString()
                    : 'Please select exp date'}
                </Text>

                <TouchableOpacity onPress={() => setOpenExpiration(true)}>
                  <Icon
                    name="calendar"
                    size={20}
                    color="#E07C8E"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.form}>
              <Text style={styles.formText}>Reminder Time</Text>
              <View
                style={[
                  styles.inputContainer,
                  { paddingVertical: 13, paddingLeft: 20 },
                ]}
              >
                <Text style={styles.input}>
                  {time
                    ? time.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Please select reminder time'}
                </Text>

                <TouchableOpacity onPress={() => setOpenTime(true)}>
                  <Icon2
                    name="access-time"
                    size={20}
                    color="#E07C8E"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
              <Text style={styles.saveBtnText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Date Pickers */}
      <DatePicker
        modal
        mode="date"
        open={showDatePicker}
        date={customDate || new Date()}
        onConfirm={date => {
          setShowDatePicker(false);
          setCustomDate(date);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      <DatePicker
        modal
        mode="date"
        open={openDateOpened}
        date={dateOpened || new Date()}
        onConfirm={selectedDate => {
          setOpenDateOpened(false);
          setDateOpened(selectedDate);
        }}
        onCancel={() => setOpenDateOpened(false)}
      />

      <DatePicker
        modal
        mode="date"
        open={openExpiration}
        date={expirationDate || new Date()}
        onConfirm={selectedDate => {
          setOpenExpiration(false);
          setExpirationDate(selectedDate);
        }}
        onCancel={() => setOpenExpiration(false)}
      />

      <DatePicker
        modal
        mode="time"
        open={openTime}
        date={time || new Date()}
        onConfirm={selectedTime => handleSetTime(selectedTime)}
        onCancel={() => setOpenTime(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF7F2',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 25,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
    color: '#E07C8E',
  },
  formContainer: {
    backgroundColor: '#FFF9F3',
    borderRadius: 20,
    padding: 20,
    paddingBottom: 0,
    shadowColor: '#AB8C8C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E07C8E',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 3,
    backgroundColor: '#ffffff',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#E07C8E',
  },
  box: {
    width: 150,
    height: 150,
    borderRadius: 20,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  inputFormContainer: {
    marginVertical: 30,
  },
  form: {
    marginBottom: 10,
  },
  formText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#E07C8E',
    marginLeft: 20,
    marginVertical: 5,
  },
  saveBtn: {
    backgroundColor: '#E07C8E',
    padding: 10,
    marginTop: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  dropdownPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E07C8E',
    borderRadius: 25,
    paddingHorizontal: 22,
    backgroundColor: '#ffffff',
  },
  dropdownStyle: {
    borderColor: '#E07C8E',
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  disabledField: {
    backgroundColor: '#f4ebebff', // agak tua dikit
  },
});

export default EditProduct;
