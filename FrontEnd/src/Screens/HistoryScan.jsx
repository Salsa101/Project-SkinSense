import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';

import ImageViewer from 'react-native-image-zoom-viewer';

import api from '../api';

const SCREEN_WIDTH = Dimensions.get('window').width;

const HistoryScan = ({ navigation, route }) => {
  const [scanData, setScanData] = useState({});
  const [quizData, setQuizData] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  const [zoomVisible, setZoomVisible] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const sheetRef = useRef(null);
  const quizSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const paramDate = route.params?.date;

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    if (paramDate) {
      const formattedDate = new Date(paramDate).toISOString().split('T')[0];
      setSelectedDates([formattedDate]);
    } else {
      setSelectedDates([today]);
    }
  }, [paramDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/scan-quiz-detail');
        if (res.data.success) {
          const scanPart = res.data.data;
          const quizPart = {};

          Object.keys(scanPart).forEach(date => {
            quizPart[date] = scanPart[date]
              .filter(item => item.quiz)
              .map(item => item.quiz);
          });

          setScanData(scanPart);
          setQuizData(quizPart);
        }
      } catch (err) {
        console.error('Error fetching scan+quiz data:', err);
        Alert.alert('Error', 'Failed to load scan data. Please try again.');
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
              setLoadingDelete(true);

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
              Alert.alert('Error', 'Failed to delete scan. Please try again.');
            } finally {
              setLoadingDelete(false);
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

  const openQuizSheet = quizItem => {
    setCurrentQuiz(quizItem);
    quizSheetRef.current?.snapToIndex(2);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 10 }}>
            {/* HEADER */}
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

            {/* CALENDAR */}
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

            {/* LIST PER SCAN */}
            {selectedDates.length > 0 &&
            scanData[selectedDates[0]] &&
            scanData[selectedDates[0]].length > 0 ? (
              <View style={{ marginTop: 20 }}>
                {scanData[selectedDates[0]].map((scanItem, index) => (
                  <View
                    key={`scan-group-${index}`}
                    style={{ marginBottom: 25 }}
                  >
                    {/* Judul per scan */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 5,
                      }}
                    >
                      <Text style={styles.sectionTitle}>{scanItem.time}</Text>
                      <View
                        style={{
                          flex: 1,
                          height: 1,
                          borderBottomWidth: 1,
                          borderStyle: 'dashed',
                          borderColor: '#ccc',
                          marginLeft: 10,
                          marginTop: 5,
                        }}
                      />
                    </View>

                    {/* BOX QUIZ */}
                    {quizData &&
                    quizData[selectedDates[0]] &&
                    quizData[selectedDates[0]][index] ? (
                      <TouchableOpacity
                        style={[styles.scanItem, { borderColor: '#6B81E0' }]}
                        onPress={() =>
                          openQuizSheet(quizData[selectedDates[0]][index])
                        }
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                          }}
                        >
                          <View
                            style={[
                              styles.scanIcon,
                              { backgroundColor: '#6B81E020' },
                            ]}
                          >
                            <Icon1 name="book" size={40} color={'#6B81E0'} />
                          </View>
                          <View>
                            <Text style={styles.scanTime}>History Quiz</Text>
                            <Text style={styles.scanCondition}>
                              Review your answer
                            </Text>
                            <Text style={styles.score}>Tap to see details</Text>
                          </View>
                        </View>

                        <View style={styles.eyeIcon}>
                          <Icon2 name="eye" size={20} color={'#E07C8E'} />
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.emptyBox}>No quiz result</Text>
                    )}

                    {/* BOX SCAN */}
                    <TouchableOpacity
                      onPress={() => openBottomSheet(scanItem)}
                      style={[styles.scanItem, { borderColor: '#E07C8E' }]}
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
                          <Text style={styles.scanTime}>History Scan</Text>
                          <Text style={styles.scanCondition}>
                            {scanItem.skinType}
                          </Text>
                          <Text style={styles.score}>
                            Score: {scanItem.score}%
                          </Text>
                        </View>
                      </View>

                      <View style={styles.eyeIcon}>
                        <Icon2 name="eye" size={20} color={'#E07C8E'} />
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Text style={{ color: '#999', fontSize: 16 }}>
                  No scan list
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom Sheet Quiz */}
        <BottomSheet
          ref={quizSheetRef}
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
            {currentQuiz && currentQuiz.length > 0 ? (
              <>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    textAlign: 'center',
                    marginBottom: 16,
                    color: '#6B81E0',
                  }}
                >
                  Quiz Review
                </Text>

                {currentQuiz.map((q, idx) => (
                  <View
                    key={idx}
                    style={{
                      marginBottom: 16,
                      backgroundColor: '#F0F3FF',
                      padding: 12,
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ fontWeight: '600', marginBottom: 6 }}>
                      Q{idx + 1}. {q.question}
                    </Text>

                    <Text style={{ color: '#1A1A1A', fontWeight: '300' }}>
                      Your Answer: {q.userAnswer || q.option || '-'}
                    </Text>
                  </View>
                ))}
              </>
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 16 }}>
                Pilih quiz dulu
              </Text>
            )}
          </BottomSheetScrollView>
        </BottomSheet>

        {/* Bottom Sheet Scan */}
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
                  <TouchableOpacity onPress={() => setZoomVisible(true)}>
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
                  </TouchableOpacity>
                </View>

                {/* Modal Zoom */}
                <Modal visible={zoomVisible} transparent={true}>
                  <ImageViewer
                    imageUrls={[
                      {
                        url: `${api.defaults.baseURL}${currentItem.imagePath}`,
                      },
                    ]}
                    enableSwipeDown
                    onSwipeDown={() => setZoomVisible(false)}
                    index={0} // mulai dari gambar Before
                  />
                </Modal>

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
                        {currentItem.score}%
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
                        {currentItem.ingredientsForYou &&
                        currentItem.ingredientsForYou.length > 0 ? (
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
                        ) : (
                          <Text style={{ color: '#999', fontStyle: 'italic' }}>
                            No recommended ingredients
                          </Text>
                        )}
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
                        {currentItem.avoidIngredients &&
                        currentItem.avoidIngredients.length > 0 ? (
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
                                ✖ {item.name} ({item.reasons.join(', ')})
                              </Text>
                            ))}
                          </View>
                        ) : (
                          <Text style={{ color: '#999', fontStyle: 'italic' }}>
                            No ingredients to avoid
                          </Text>
                        )}
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
                      {currentItem.products &&
                      currentItem.products.length > 0 ? (
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{
                            flexDirection: 'row',
                            paddingRight: 12,
                          }}
                        >
                          {currentItem.products.map((product, index) => (
                            <View
                              key={index}
                              style={{
                                alignItems: 'center',
                                width: 120,
                                backgroundColor: '#FFEAEA',
                                padding: 10,
                                borderRadius: 8,
                                marginRight:
                                  index === currentItem.products.length - 1
                                    ? 0
                                    : 12,
                              }}
                            >
                              <Image
                                source={
                                  product.image
                                    ? {
                                        uri: `${api.defaults.baseURL}${product.image}`
                                      }
                                    : require('../../assets/product-placeholder.jpg')
                                }
                                style={{
                                  width: 95,
                                  height: 95,
                                  borderRadius: 8,
                                  marginBottom: 4,
                                }}
                              />

                              <Text
                                style={{
                                  marginTop: 4,
                                  fontSize: 12,
                                  textAlign: 'flex-start',
                                  fontWeight: 'bold',
                                  color: '#E07C8E',
                                }}
                              >
                                {product.name}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  marginTop: 8,
                                  alignSelf: 'flex-end',
                                  color: '#A77B7B',
                                }}
                                onPress={() =>
                                  navigation.navigate('ProductInformation', {
                                    productId: product.id,
                                  })
                                }
                              >
                                See details →
                              </Text>
                            </View>
                          ))}
                        </ScrollView>
                      ) : (
                        <Text style={{ color: '#999', fontStyle: 'italic' }}>
                          No recommended products
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#8A6A6A',
                      marginBottom: 8,
                      fontStyle: 'italic',
                    }}
                  >
                    *This skin scan is intended as a supporting tool only and
                    does not replace professional consultation. For accurate
                    treatment, please consult a skincare professional.
                  </Text>
                </View>

                {/* Compare Button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: '#E07C8E',
                    paddingVertical: 12,
                    borderRadius: 30,
                    alignItems: 'center',
                    marginBottom: 10,
                    opacity: loadingDelete ? 0.6 : 1,
                  }}
                  onPress={handleDeleteScan}
                  disabled={loadingDelete}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {loadingDelete ? 'Deleting...' : 'Delete'}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
});

export default HistoryScan;
