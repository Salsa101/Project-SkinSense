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

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

import DropDownPicker from 'react-native-dropdown-picker';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {
  SelectList,
  MultipleSelectList,
} from 'react-native-dropdown-select-list';

import { launchImageLibrary } from 'react-native-image-picker';

const AddProduct = ({ navigation }) => {
  // Product Type
  const [openProduct, setOpenProduct] = useState(false);
  const [productValue, setProductValue] = useState(null);
  const [productItems, setProductItems] = useState([
    { key: 'cleanser', value: 'Cleanser' },
    { key: 'toner', value: 'Toner' },
    { key: 'serum', value: 'Serum' },
    { key: 'moisturizer', value: 'Moisturizer' },
    { key: 'mask', value: 'Mask' },
  ]);

  //Routine Type
  const [openRoutine, setOpenRoutine] = useState(false);
  const [routineValue, setRoutineValue] = useState(null);
  const [routineItems, setRoutineItems] = useState([
    { key: 'daily', value: 'Daily' },
    { key: 'weekly', value: 'Weekly' },
    { key: 'custom', value: 'Custom' },
  ]);

  //Routine Day
  const [openRoutineDay, setOpenRoutineDay] = useState(false);
  const [routineValueDay, setRoutineValueDay] = useState([]);
  const [routineItemsDay, setRoutineItemsDay] = useState([
    { key: 'monday', value: 'Monday' },
    { key: 'tuesday', value: 'Tuesday' },
    { key: 'wednesday', value: 'Wednesday' },
    { key: 'thursday', value: 'Thursday' },
    { key: 'friday', value: 'Friday' },
    { key: 'saturday', value: 'Saturday' },
    { key: 'sunday', value: 'Sunday' },
  ]);

  // Custom date
  const [customDate, setCustomDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  //Time of Day
  const [openTimeDay, setOpenTimeDay] = useState(false);
  const [timeDayValue, setTimeDayValue] = useState(null);
  const [timeDayItems, setTimeDayItems] = useState([
    { key: 'morning', value: 'Morning' },
    { key: 'night', value: 'Night' },
  ]);

  const [openDateOpened, setOpenDateOpened] = useState(false);
  const [openExpiration, setOpenExpiration] = useState(false);
  const [dateOpened, setDateOpened] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);

  const [openTime, setOpenTime] = useState(false);
  const [time, setTime] = useState(null);

  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');

  const [imageUri, setImageUri] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [productStep, setProductStep] = useState('');

  const [isVerified, setIsVerified] = useState(false);

  const [openIsOpened, setOpenIsOpened] = useState(null);
  const [isOpened, setIsOpened] = useState(null);

  const [shelfLifeMonths, setShelfLifeMonths] = useState(0);

  // pilih & preview image
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

  const handleSave = async () => {
    try {
      if (!routineValue || !timeDayValue) {
        Alert.alert('Error', 'Please select routine type and time of day');
        return;
      }

      const payload = new FormData();

      if (selectedProductId) {
        // Produk existing → cukup ID
        payload.append('productId', selectedProductId);
      } else {
        // Produk baru → kirim data master
        if (!productName || !productBrand) {
          Alert.alert('Error', 'Please enter product name and brand');
          return;
        }
        payload.append('productName', productName);
        payload.append('productBrand', productBrand);
        payload.append('productType', productValue);

        if (selectedFile) {
          payload.append('productImage', selectedFile);
        }
      }

      // Data rutinitas
      payload.append('productStep', productStep);
      payload.append('isOpened', isOpened);
      if (isOpened === 'yes' && dateOpened) {
        payload.append('dateOpened', dateOpened.toISOString());
        payload.append('expirationDate', expirationDate.toISOString());
      } else if (isOpened === 'no' && expirationDate) {
        payload.append('expirationDate', expirationDate.toISOString());
      }

      payload.append('reminderTime', time.toTimeString().split(' ')[0]);
      payload.append('routineType', routineValue);
      payload.append('timeOfDay', timeDayValue);

      if (routineValueDay.length > 0) {
        payload.append(
          'dayOfWeek',
          JSON.stringify(routineValueDay.map(d => d.toLowerCase())),
        );
      }

      if (customDate instanceof Date && !isNaN(customDate)) {
        payload.append('customDate', customDate.toISOString().split('T')[0]);
      }

      const res = await api.post('/add-routine-products', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Product added to routine!', [
        { text: 'OK', onPress: () => navigation.navigate('EditRoutine') },
      ]);
      console.log('Saved:', res.data);
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Error',
        err.response?.data?.message || err.message || 'Something went wrong',
      );
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleSearch = async text => {
    setSearchQuery(text);
    if (text.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await api.get(`/routine-products/search?query=${text}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Search produk
  const handleSelectProduct = product => {
    setSelectedProductId(product.id);
    setProductName(product.productName);
    setProductBrand(product.productBrand);
    setProductValue(product.productType);

    if (product.productImage) {
      setImageUri(`http://10.0.2.2:3000${product.productImage}`);
    } else {
      setImageUri(null);
    }

    setSelectedFile(null);
    setSearchResults([]);
    setSearchQuery(product.productName);

    setShelfLifeMonths(product.shelf_life_months || 0);

    setIsVerified(product.isVerified);
  };

  const shelfLifeDefaults = {
    cleanser: 12,
    sunscreen: 12,
    toner: 12,
    serum: 6,
    moisturizer: 12,
    mask: 3,
  };

  const calculateExpiration = (baseDate, months) => {
    if (!months) return null;
    const exp = new Date(baseDate);
    exp.setMonth(exp.getMonth() + months);
    return exp;
  };

  useEffect(() => {
    if (productValue && !selectedProductId) {
      setShelfLifeMonths(shelfLifeDefaults[productValue] || 6);
    }
  }, [productValue, selectedProductId]);

  useEffect(() => {
    if (!shelfLifeMonths) return;

    if (isOpened === 'yes' && dateOpened) {
      setExpirationDate(calculateExpiration(dateOpened, shelfLifeMonths));
    } else if (isOpened === 'no') {
      setExpirationDate(null);
    }
  }, [isOpened, dateOpened, shelfLifeMonths]);

  useEffect(() => {
    if (isOpened === 'yes') {
      setDateOpened(null);
      setExpirationDate(null);
    } else if (isOpened === 'no') {
      setDateOpened(null);
      setExpirationDate(null);
    }
  }, [isOpened]);

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
        <Text style={styles.headerText}>Add Product</Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Icon name="search" size={20} color="#E07C8E" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Search by product name"
              placeholderTextColor="#E07C8E"
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>

          {searchResults.length > 0 && (
            <View
              style={{ backgroundColor: '#fff', borderRadius: 8, marginTop: 5 }}
            >
              {searchResults.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={{
                    padding: 10,
                    borderBottomWidth: 1,
                    borderColor: '#eee',
                  }}
                  onPress={() => handleSelectProduct(item)}
                >
                  <Text
                    style={{ fontFamily: 'Poppins-Medium', color: '#E07C8E' }}
                  >
                    {item.productName} - {item.productBrand}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text
            style={{
              marginVertical: 20,
              alignSelf: 'center',
              fontFamily: 'Poppins-Medium',
              color: '#E07C8E',
            }}
          >
            or add manually
          </Text>

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
            <View style={[styles.form, { zIndex: 99 }]}>
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
            <View style={[styles.form, { zIndex: 99 }]}>
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
            <View style={[styles.form, { zIndex: 99 }]}>
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
              <SelectList
                setSelected={val => setProductValue(val)}
                data={productItems}
                save="key"
                placeholder="Select product type"
                boxStyles={{
                  ...styles.dropdownPicker,
                  ...(isVerified ? styles.disabledField : {}),
                }}
                inputStyles={{
                  color: '#E07C8E',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                }}
                dropdownStyles={styles.dropdownStyle}
                dropdownTextStyles={{
                  color: '#E07C8E',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                }}
                arrowicon={
                  <Icon name="chevron-down" size={20} color="#E07C8E" />
                }
              />
            </View>

            {/* Routine Type */}
            <View style={[styles.form, { zIndex: 99 }]}>
              <Text style={styles.formText}>Routine Type</Text>
              <SelectList
                setSelected={val => setRoutineValue(val)}
                data={routineItems}
                save="key"
                placeholder="Select routine type"
                boxStyles={{
                  ...styles.dropdownPicker,
                }}
                inputStyles={{
                  color: '#E07C8E',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                }}
                dropdownStyles={styles.dropdownStyle}
                dropdownTextStyles={{
                  color: '#E07C8E',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                }}
                arrowicon={
                  <Icon name="chevron-down" size={20} color="#E07C8E" />
                }
              />
            </View>

            {/* Weekly: Routine Day */}
            {routineValue === 'weekly' && (
              <View style={[styles.form, { zIndex: 98 }]}>
                <Text style={styles.formText}>Routine Day</Text>
                <MultipleSelectList
                  label="Selected Days"
                  setSelected={val => setRoutineValueDay(val)}
                  data={routineItemsDay.map(item => ({
                    key: item.value,
                    value: item.label || item.value,
                  }))}
                  save="key"
                  placeholder="Select days"
                  boxStyles={{
                    ...styles.dropdownPicker,
                  }}
                  inputStyles={{
                    color: '#E07C8E',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                  }}
                  dropdownStyles={styles.dropdownStyle}
                  dropdownTextStyles={{
                    color: '#E07C8E',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                  }}
                  arrowicon={
                    <Icon name="chevron-down" size={20} color="#E07C8E" />
                  }
                  searchicon={<Icon name="search" size={16} color="#E07C8E" />}
                  closeicon={<Icon name="close" size={16} color="#E07C8E" />}
                />
              </View>
            )}

            {/* Custom: pilih tanggal sekali */}
            {routineValue === 'custom' && (
              <View style={[styles.form, { zIndex: 97 }]}>
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
            <View style={[styles.form, { zIndex: 96 }]}>
              <Text style={styles.formText}>Time of Day</Text>
              <SelectList
                setSelected={val => setTimeDayValue(val)}
                data={timeDayItems}
                save="key"
                placeholder="Select time of day"
                boxStyles={{
                  ...styles.dropdownPicker,
                }}
                inputStyles={{
                  color: '#E07C8E',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                }}
                dropdownStyles={styles.dropdownStyle}
                dropdownTextStyles={{
                  color: '#E07C8E',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                }}
                arrowicon={
                  <Icon name="chevron-down" size={20} color="#E07C8E" />
                }
              />
            </View>

            {/* Is Opened Dropdown */}
            <View style={[styles.form, { zIndex: 95 }]}>
              <Text style={styles.formText}>Product Opened?</Text>
              <SelectList
                setSelected={val => setIsOpened(val)}
                data={[
                  { key: 'yes', value: 'Yes' },
                  { key: 'no', value: 'No' },
                ]}
                save="key"
                placeholder="Select product status"
                boxStyles={{
                  ...styles.dropdownPicker,
                }}
                inputStyles={{
                  color: '#E07C8E',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                }}
                dropdownStyles={styles.dropdownStyle}
                dropdownTextStyles={{
                  color: '#E07C8E',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                }}
                arrowicon={
                  <Icon name="chevron-down" size={20} color="#E07C8E" />
                }
              />
            </View>

            {/* Date Opened */}
            {isOpened === 'yes' && (
              <View style={[styles.form, { zIndex: 94 }]}>
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
            )}

            {/* Expiration Date */}
            <View style={styles.form}>
              <Text style={styles.formText}>Expiration Date</Text>
              <TouchableOpacity
                onPress={() => isOpened === 'no' && setOpenExpiration(true)}
                activeOpacity={isOpened === 'no' ? 0.7 : 1}
                style={[
                  styles.inputContainer,
                  { paddingVertical: 13, paddingLeft: 20 },
                  isOpened === 'yes' && styles.disabledField, // disable kalau auto-calculated
                ]}
                disabled={isOpened === 'yes'}
              >
                <Text style={styles.input}>
                  {expirationDate
                    ? expirationDate.toLocaleDateString()
                    : isOpened === 'no'
                    ? 'Please select exp date'
                    : 'Auto calculated'}
                </Text>

                <Icon
                  name="calendar"
                  size={20}
                  color={'#E07C8E'}
                  style={styles.icon}
                />
              </TouchableOpacity>
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

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Date Pickers */}
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        date={customDate || new Date()}
        onConfirm={date => {
          setShowDatePicker(false);
          setCustomDate(date);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      <DateTimePickerModal
        isVisible={openDateOpened}
        mode="date"
        date={dateOpened || new Date()}
        onConfirm={selectedDate => {
          setOpenDateOpened(false);
          setDateOpened(selectedDate);
        }}
        onCancel={() => setOpenDateOpened(false)}
        pickerContainerStyle={{
          backgroundColor: '#E07C8E',
        }}
      />

      <DateTimePickerModal
        isVisible={openExpiration}
        mode="date"
        date={expirationDate || new Date()}
        onConfirm={selectedDate => {
          setOpenExpiration(false);
          setExpirationDate(selectedDate);
        }}
        onCancel={() => setOpenExpiration(false)}
      />

      <DateTimePickerModal
        isVisible={openTime}
        mode="time"
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

export default AddProduct;
