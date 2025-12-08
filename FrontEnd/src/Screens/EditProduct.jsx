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

import {
  SelectList,
  MultipleSelectList,
} from 'react-native-dropdown-select-list';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

import DropDownPicker from 'react-native-dropdown-picker';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

const EditProduct = ({ route, navigation }) => {
  const { id } = route.params;
  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productStep, setProductStep] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
    { key: 'morning', value: 'Morning' },
    { key: 'night', value: 'Night' },
  ]);

  const [openDateOpened, setOpenDateOpened] = useState(false);
  const [openExpiration, setOpenExpiration] = useState(false);
  const [dateOpened, setDateOpened] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);

  const [openTime, setOpenTime] = useState(false);
  const [time, setTime] = useState(null);

  const [isVerified, setIsVerified] = useState(false);

  const [openIsOpened, setOpenIsOpened] = useState(false);
  const [isOpened, setIsOpened] = useState(null); // yes | no

  const [shelfLifeMonths, setShelfLifeMonths] = useState(0);

  const [hasPAO, setHasPAO] = useState(null);
  const [paoMonths, setPaoMonths] = useState('');

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
          setIsOpened(p.isOpened ? 'yes' : 'no');
          setProductValue(p.Product.productType || null);
          setRoutineValue(p.routineType || null);
          // setRoutineValueDay(p.routineDay || []);
          setCustomDate(p.customDate ? new Date(p.customDate) : null);
          setTimeDayValue(p.timeOfDay || null);
          setRoutineValueDay(p.dayOfWeek || null);
          setDateOpened(p.dateOpened ? new Date(p.dateOpened) : null);
          if (p.isOpened === false && p.expirationDate) {
            setExpirationDate(new Date(p.expirationDate));
          } else if (p.isOpened === true) {
            setExpirationDate(null); // nanti auto calculated via useEffect
          }

          // PAO info
          // PAO info dari database
          if (p.hasPao) {
            setHasPAO('yes');
            setPaoMonths(p.paoMonths?.toString() || '');
          } else {
            setHasPAO('no');
            setPaoMonths('');
          }

          if (p.Product.productImage) {
            setImageUri(`${api.defaults.baseURL}${p.Product.productImage}`);
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
    setLoading(true);

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
      if (routineValue === 'weekly') {
        payload.append('dayOfWeek', JSON.stringify(routineValueDay));
      } else {
        payload.append('dayOfWeek', '[]');
      }
      if (routineValue === 'custom' && customDate) {
        payload.append('customDate', customDate.toISOString());
      } else {
        payload.append('customDate', 'null');
      }
      if (timeDayValue) payload.append('timeOfDay', timeDayValue);
      payload.append('isOpened', isOpened);
      if (isOpened === 'yes' && dateOpened) {
        payload.append('dateOpened', dateOpened.toISOString());
        payload.append('expirationDate', expirationDate.toISOString());
      } else if (isOpened === 'no' && expirationDate) {
        payload.append('expirationDate', expirationDate.toISOString());
      }

      payload.append('hasPao', hasPAO === 'yes');

      // PAO
      if (hasPAO === 'yes') {
        payload.append('paoMonths', paoMonths);
      } else {
        payload.append('paoMonths', 0); // kalau no
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
    } finally {
      setLoading(false);
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
    if (productValue) {
      setShelfLifeMonths(shelfLifeDefaults[productValue] || 6);
    }
  }, [productValue]);

  useEffect(() => {
    if (!dateOpened) return;

    let monthsToAdd = 0;

    if (isOpened === 'yes') {
      // pakai PAO kalau ada, kalau nggak pakai shelfLife
      monthsToAdd =
        hasPAO === 'yes' ? parseInt(paoMonths) || 0 : shelfLifeMonths;

      if (monthsToAdd > 0) {
        setExpirationDate(calculateExpiration(dateOpened, monthsToAdd));
      } else {
        setExpirationDate(null);
      }
    } else if (isOpened === 'no') {
      // produk belum dibuka, bisa pakai shelfLife dari hari ini
      if (shelfLifeMonths > 0) {
        setExpirationDate(calculateExpiration(new Date(), shelfLifeMonths));
      } else {
        setExpirationDate(null);
      }
    }
  }, [isOpened, dateOpened, shelfLifeMonths, hasPAO, paoMonths]);

  console.log(
    'Default Option:',
    routineItemsDay.filter(item => routineValueDay.includes(item.key)),
  );

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
            <View
              style={[styles.form, { zIndex: 100 }]}
              pointerEvents={isVerified ? 'none' : 'auto'}
            >
              <Text style={styles.formText}>Product Type</Text>
              <SelectList
                setSelected={val => setProductValue(val)}
                data={productItems}
                save="key"
                placeholder="Select product type"
                defaultOption={
                  productValue
                    ? productItems.find(item => item.key === productValue)
                    : null
                }
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
                disabled={isVerified}
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
                value={routineValue}
                defaultOption={routineItems.find(
                  item => item.key === routineValue,
                )}
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
            <View style={[styles.form, { zIndex: 96 }]}>
              <Text style={styles.formText}>Time of Day</Text>
              <SelectList
                setSelected={val => setTimeDayValue(val)}
                data={timeDayItems}
                save="key"
                placeholder="Select time of day"
                value={timeDayValue}
                defaultOption={timeDayItems.find(
                  item => item.key === timeDayValue,
                )}
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

            {/* PAO Info Dropdown */}
            <View style={[styles.form, { zIndex: 96 }]}>
              <Text style={styles.formText}>Does product have PAO info?</Text>
              <SelectList
                setSelected={val => setHasPAO(val)}
                data={[
                  { key: 'yes', value: 'Yes' },
                  { key: 'no', value: 'No' },
                ]}
                save="key"
                placeholder="Select option"
                defaultOption={
                  hasPAO
                    ? { key: hasPAO, value: hasPAO === 'yes' ? 'Yes' : 'No' }
                    : null
                }
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

            {/* PAO Months Input - hanya muncul kalau hasPAO === 'yes' */}
            {hasPAO === 'yes' && (
              <View style={[styles.form, { zIndex: 95 }]}>
                <Text style={styles.formText}>PAO (months)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter PAO in months"
                    placeholderTextColor="#E07C8E"
                    keyboardType="numeric"
                    value={paoMonths}
                    onChangeText={text => {
                      const number = text.replace(/[^0-9]/g, '');
                      setPaoMonths(number);
                    }}
                  />
                </View>
              </View>
            )}

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
                value={isOpened}
                defaultOption={[
                  { key: 'yes', value: 'Yes' },
                  { key: 'no', value: 'No' },
                ].find(item => item.key === isOpened)}
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
                  isOpened === 'yes' && styles.disabledField,
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

            <TouchableOpacity
              style={[styles.saveBtn, loading && { opacity: 0.6 }]}
              onPress={handleUpdate}
              disabled={loading}
            >
              <Text style={styles.saveBtnText}>
                {loading ? 'Updating...' : 'Update'}
              </Text>
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

      {/* <DateTimePickerModal
        isVisible={openTime}
        mode="time"
        date={time || new Date()}
        onConfirm={selectedTime => handleSetTime(selectedTime)}
        onCancel={() => setOpenTime(false)}
      /> */}
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
