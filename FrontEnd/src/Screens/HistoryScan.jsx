import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';

import api from '../api';

const SCREEN_WIDTH = Dimensions.get('window').width;

const HistoryScan = ({ navigation }) => {
  const [scanData, setScanData] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);

  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDates([today]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/compare-scan-detail');
        if (res.data.success) {
          setScanData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching scan data:', err);
      }
    };
    fetchData();
  }, []);

  const handleDeleteScan = () => {
    if (!currentItem) return;

    Alert.alert(
      'Delete Scan',
      'Are you sure you want to delete this scan?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/scan-detail/${currentItem.id}`);

              const updatedData = { ...scanData };
              const dateKey = selectedDates[0];
              updatedData[dateKey] = updatedData[dateKey].filter(
                item => item.id !== currentItem.id,
              );

              if (updatedData[dateKey].length === 0) {
                delete updatedData[dateKey];
              }

              setScanData(updatedData);
              setCurrentItem(null);
              sheetRef.current?.close();
            } catch (err) {
              console.error('Failed to delete scan:', err);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const markedDates = {};
  Object.keys(scanData).forEach(date => {
    const scans = scanData[date];
    const maxDots = 3;
    markedDates[date] = {
      dots: scans.slice(0, maxDots).map((item, index) => ({
        key: `scan-${index}-${item.time}`,
        color: '#FF6B81',
      })),
    };
  });

  const handleSelectDate = day => setSelectedDates([day.dateString]);

  const formatDateTime = (dateString, time) => {
    const [year, month, day] = dateString.split('-');
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${day} ${monthNames[parseInt(month) - 1]} ${year}, ${time}`;
  };

  const openBottomSheet = item => {
    setCurrentItem(item);
    sheetRef.current?.snapToIndex(2);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 10 }}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
              >
                <Icon name="arrow-left" size={20} color="#E07C8E" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>History Scan</Text>
              <View style={styles.editBtn}></View>
            </View>

            <Calendar
              horizontal
              pagingEnabled
              calendarWidth={350}
              onDayPress={handleSelectDate}
              markedDates={markedDates}
              markingType={'multi-dot'}
              theme={{
                todayTextColor: '#FF6B81',
                selectedDayBackgroundColor: '#FF6B81',
              }}
            />

            {selectedDates.length > 0 &&
            scanData[selectedDates[0]] &&
            scanData[selectedDates[0]].length > 0 ? (
              <FlatList
                style={{ marginTop: 15 }}
                data={scanData[selectedDates[0]]}
                keyExtractor={(item, index) => `${selectedDates[0]}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => openBottomSheet(item)}
                    style={styles.scanItem}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <View style={styles.scanIcon}>
                        <Icon1 name="scan" size={40} color={'#E07C8E'} />
                      </View>
                      <View>
                        <Text style={styles.scanTime}>
                          {formatDateTime(selectedDates[0], item.time)}
                        </Text>
                        <Text style={styles.scanCondition}>
                          {item.skinType}
                        </Text>
                        <Text style={styles.score}>
                          Score: {item.score}/100
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity onPress={() => openBottomSheet(item)}>
                      <View style={styles.eyeIcon}>
                        <Icon2 name="eye" size={20} color={'#E07C8E'} />
                      </View>
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Text style={{ color: '#999', fontSize: 16 }}>
                  No scan list
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom Sheet */}
        <BottomSheet
          ref={sheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backdropComponent={props => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              pressBehavior="close"
              opacity={0.5}
              enableTouchThrough={false}
            />
          )}
          backgroundStyle={{ backgroundColor: 'white', borderRadius: 16 }}
        >
          <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>
            {currentItem ? (
              <>
                {/* Header */}
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    textAlign: 'center',
                    marginBottom: 16,
                    color: '#E07C8E',
                  }}
                >
                  Scan Detail -{' '}
                  {formatDateTime(selectedDates[0], currentItem.time)}
                </Text>

                {/* Image */}
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                  <Image
                    source={{
                      uri: `${api.defaults.baseURL}${currentItem.imagePath}`,
                    }}
                    style={{
                      width: SCREEN_WIDTH - 40,
                      height: SCREEN_WIDTH - 40,
                      borderRadius: 15,
                    }}
                  />
                </View>

                {/* Scan Info */}
                <View style={{ marginBottom: 16 }}>
                  <View
                    style={{ flexDirection: 'row', marginBottom: 8, gap: 12 }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '600', marginBottom: 4 }}>
                        Skin Type :
                      </Text>
                      <Text
                        style={{
                          backgroundColor: '#FDE2E4',
                          color: '#E07C8E',
                          padding: 6,
                          borderRadius: 6,
                        }}
                      >
                        {currentItem.skinType}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '600', marginBottom: 4 }}>
                        Score :
                      </Text>
                      <Text
                        style={{
                          backgroundColor: '#FDE2E4',
                          color: '#E07C8E',
                          padding: 6,
                          borderRadius: 6,
                        }}
                      >
                        {currentItem.score}/100
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '600', marginBottom: 4 }}>
                        Acne Spotted :
                      </Text>
                      <Text
                        style={{
                          backgroundColor: '#FDE2E4',
                          color: '#E07C8E',
                          padding: 6,
                          borderRadius: 6,
                        }}
                      >
                        {currentItem.acneCount} Acne Spotted
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '600', marginBottom: 4 }}>
                        Severity :
                      </Text>
                      <Text
                        style={{
                          backgroundColor: '#FDE2E4',
                          color: '#E07C8E',
                          padding: 6,
                          borderRadius: 6,
                        }}
                      >
                        {currentItem.severity}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    height: 1,
                    backgroundColor: '#E07C8E',
                    width: '100%',
                    marginTop: 10,
                    marginBottom: 20,
                  }}
                />

                {/* Timeline Sections */}
                <View style={{ marginBottom: 16, paddingLeft: 5 }}>
                  {/* Ingredients For You */}
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: 20, alignItems: 'center' }}>
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: '#E07C8E',
                        }}
                      />
                      <View
                        style={{
                          flex: 1,
                          width: 2,
                          backgroundColor: '#E07C8E',
                          marginTop: 2,
                        }}
                      />
                    </View>

                    <View
                      style={{ flex: 1, paddingLeft: 12, marginBottom: 16 }}
                    >
                      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
                        Ingredients For You
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          gap: 8,
                        }}
                      >
                        {currentItem.ingredientsForYou.map((item, idx) => (
                          <Text
                            key={idx}
                            style={{
                              backgroundColor: '#FFF0F2',
                              color: '#E07C8E',
                              padding: 6,
                              borderRadius: 6,
                            }}
                          >
                            ✔ {item}
                          </Text>
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* What to Avoid */}
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: 20, alignItems: 'center' }}>
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: '#E07C8E',
                        }}
                      />
                      <View
                        style={{
                          flex: 1,
                          width: 2,
                          backgroundColor: '#E07C8E',
                          marginTop: 2,
                        }}
                      />
                    </View>

                    <View
                      style={{ flex: 1, paddingLeft: 12, marginBottom: 16 }}
                    >
                      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
                        What to Avoid
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          gap: 8,
                        }}
                      >
                        {currentItem.avoidIngredients.map((item, idx) => (
                          <Text
                            key={idx}
                            style={{
                              backgroundColor: '#FFEAEA',
                              color: '#E07C8E',
                              padding: 6,
                              borderRadius: 6,
                            }}
                          >
                            ✖ {item}
                          </Text>
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* Products For You */}
                  <View style={{ flexDirection: 'row', marginBottom: 24 }}>
                    <View style={{ width: 20, alignItems: 'center' }}>
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: '#E07C8E',
                        }}
                      />
                    </View>

                    <View style={{ flex: 1, paddingLeft: 12 }}>
                      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
                        Products For You
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        {currentItem.products.map((product, idx) => (
                          <View
                            key={idx}
                            style={{
                              alignItems: 'center',
                              width: 80,
                              backgroundColor: '#c7c7c7ff',
                              padding: 10,
                              borderRadius: 8,
                            }}
                          >
                            <Image
                              source={product.image}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: 8,
                                marginBottom: 4,
                              }}
                            />
                            <Text style={{ fontSize: 12, textAlign: 'center' }}>
                              {product.name}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>

                {/* Compare Button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: '#E07C8E',
                    paddingVertical: 12,
                    borderRadius: 30,
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                  onPress={handleDeleteScan}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 16 }}>
                Pilih scan dulu
              </Text>
            )}
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF7F2' },
  scanItem: {
    padding: 12,
    backgroundColor: '#F8D3D5',
    borderRadius: 8,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scanTime: { fontWeight: 'bold' },
  scanCondition: { marginTop: 4 },
  scanScore: { marginTop: 2, color: '#555' },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FAE4E3',
    paddingBottom: 12,
    paddingTop: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: '#d95c7e',
    paddingVertical: 8,
    paddingLeft: 28,
    paddingRight: 12,
    borderRadius: 50,
    width: '100%',
  },
  topText: {
    color: '#333333',
    fontSize: 14,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  dateText: { color: 'white', fontSize: 14, marginTop: 2 },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backBtn: { width: 40, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginTop: 15,
    fontSize: 18,
    color: '#E07C8E',
    fontFamily: 'Poppins-Bold',
  },
  editBtn: { width: 40 },
  scanIcon: {
    width: 65,
    height: 65,
    borderRadius: 8,
    backgroundColor: '#FEF6F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF6F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HistoryScan;
