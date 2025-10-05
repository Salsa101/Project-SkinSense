import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
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

const SCREEN_HEIGHT = Dimensions.get('window').height;

const dummyScanData = {
  '2025-10-12': [
    { time: '19:20', condition: 'Dry Skin, Acne Prone', score: 80 },
  ],
  '2025-10-28': [
    { time: '19:20', condition: 'Dry Skin, Acne Prone', score: 80 },
    { time: '19:30', condition: 'Dry Skin, Acne Prone', score: 80 },
  ],
  '2025-10-22': [{ time: '18:00', condition: 'Oily Skin', score: 90 }],
};

const CompareScan = ({ navigation }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);

  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const markedDates = {};
  Object.keys(dummyScanData).forEach(date => {
    const scans = dummyScanData[date];
    const maxDots = 3;
    markedDates[date] = {
      dots: scans.slice(0, maxDots).map((item, index) => ({
        key: `scan-${index}-${item.time}`,
        color: '#FF6B81',
      })),
    };
  });

  const handleSelectDate = day => setSelectedDates([day.dateString]);

  const toggleSelectItem = item => {
    const id = `${selectedDates[0]}-${item.time}`;
    if (selectedItems.includes(id)) {
      setSelectedItems(prev => prev.filter(i => i !== id));
    } else {
      if (selectedItems.length >= 2) {
        alert('Item yang diselect hanya boleh 2');
        return;
      }
      setSelectedItems(prev => [...prev, id]);
    }
  };

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
    sheetRef.current?.snapToIndex(2); // buka sheet ke posisi tengah (50%)
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ flex: 1, padding: 16 }}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" size={20} color="#E07C8E" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Compare Scan</Text>
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

          <FlatList
            style={{ marginTop: 15 }}
            data={selectedDates.length ? dummyScanData[selectedDates[0]] : []}
            keyExtractor={(item, index) => `${selectedDates[0]}-${index}`}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) => {
              const id = `${selectedDates[0]}-${item.time}`;
              const isSelected = selectedItems.includes(id);

              return (
                <TouchableOpacity
                  onPress={() => toggleSelectItem(item)}
                  style={[
                    styles.scanItem,
                    isSelected && { backgroundColor: '#E07C8E' },
                  ]}
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
                      <Text
                        style={[
                          styles.scanTime,
                          isSelected && { color: 'white' },
                        ]}
                      >
                        {formatDateTime(selectedDates[0], item.time)}
                      </Text>
                      <Text
                        style={[
                          styles.scanCondition,
                          isSelected && { color: 'white' },
                        ]}
                      >
                        {item.condition}
                      </Text>
                      <Text
                        style={[
                          styles.scanScore,
                          isSelected && { color: 'white' },
                        ]}
                      >
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
              );
            }}
          />
        </View>

        {selectedItems.length > 0 && (
          <View style={styles.buttonContainer}>
            <Text style={styles.topText}>
              Please select 2 log history face scan ({selectedItems.length}/2)
            </Text>
            <TouchableOpacity style={styles.button}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Text style={styles.buttonText}>
                    {selectedItems.length} item
                    {selectedItems.length > 1 ? 's' : ''} selected
                  </Text>
                  <Text style={styles.dateText}>
                    {selectedItems
                      .map(id => {
                        const parts = id.split('-');
                        const date = `${parts[0]}-${parts[1]}-${parts[2]}`;
                        const time = parts[3];
                        return formatDateTime(date, time);
                      })
                      .join(' & ')}
                  </Text>
                </View>
                <View style={styles.arrowBtn}>
                  <Icon name="arrow-right" size={20} color="#d95c7e" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Sheet */}
        <BottomSheet
          ref={sheetRef}
          index={-1} // tertutup awalnya
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backdropComponent={props => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1} // hilang saat sheet tertutup
              appearsOnIndex={0} // muncul saat sheet terbuka
              pressBehavior="close" // klik overlay = tutup sheet
              opacity={0.5} // transparansi overlay
              enableTouchThrough={false} // mencegah klik diteruskan ke bawah
            />
          )}
          backgroundStyle={{ backgroundColor: 'white', borderRadius: 16 }}
        >
          <BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
            {currentItem ? (
              <>
                <Text
                  style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 16 }}
                >
                  Scan Detail -{' '}
                  {formatDateTime(selectedDates[0], currentItem.time)}
                </Text>
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                  <Image
                    source={{ uri: 'https://your-image-link-or-state' }}
                    style={{ width: 150, height: 150, borderRadius: 8 }}
                  />
                </View>
                <Text>Skin Type: Dry Skin, Acne Prone</Text>
                <Text>Score: {currentItem.score}/100</Text>
                <Text>Acne Spotted: 5 Acne Spotted</Text>
                <Text>Severity: Medium</Text>
              </>
            ) : (
              <Text>Pilih scan dulu</Text>
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

export default CompareScan;
