import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/FontAwesome5';

import api from '../api';
import Navbar from '../Components/Navbar';

const Calendar = () => {
  const [selected, setSelected] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [activeTab, setActiveTab] = useState('Morning');
  const [morningTasks, setMorningTasks] = useState([]);
  const [nightTasks, setNightTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('Calendar');

  // fetch data berdasarkan tanggal
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resMorning = await api.get(`/routine-products/view/morning`, {
          params: { date: selected },
        });
        const resNight = await api.get(`/routine-products/view/night`, {
          params: { date: selected },
        });
        setMorningTasks(resMorning.data);
        setNightTasks(resNight.data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selected]);

  const toggleDone = async (id, type) => {
    try {
      const res = await api.patch(`/routine-products/toggle-done`, {
        routineProductId: id,
      });

      const updatedTasks = res.data.map(t => ({
        ...t,
        done: t.doneStatus,
      }));

      if (type === 'Morning') setMorningTasks(updatedTasks);
      else setNightTasks(updatedTasks);
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const currentData = activeTab === 'Morning' ? morningTasks : nightTasks;

  // mark selected date
  const markedDates = useMemo(() => {
    return {
      [selected]: { selected: true, selectedColor: '#ff69b4' },
    };
  }, [selected]);

  const renderCard = (item, type) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, item.doneStatus && styles.cardDone]}
      onPress={() => toggleDone(item.id, type)}
    >
      <View style={styles.infoBox}>
        <Image
          source={
            item.Product?.productImage
              ? { uri: `${api.defaults.baseURL}${item.Product.productImage}` }
              : require('../../assets/product-placeholder.jpg')
          }
          style={styles.productImage}
        />
        <View style={styles.info}>
          <Text style={styles.step}>
            Step {item.productStep}:{' '}
            {item.Product?.productType
              ? item.Product.productType.charAt(0).toUpperCase() +
                item.Product.productType.slice(1)
              : ''}
          </Text>
          <Text style={styles.product} numberOfLines={1} ellipsizeMode="tail">
            {item.Product?.productName}
          </Text>
        </View>
        <Icon
          name={item.doneStatus ? 'check-circle' : 'circle-o'}
          size={22}
          color={item.doneStatus ? '#E07C8E' : '#f49babff'}
          style={{ marginLeft: 'auto' }}
        />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ActivityIndicator
        style={{ flex: 1, justifyContent: 'center' }}
        size="large"
        color="#DE576F"
      />
    );
  }

  return (
    <CalendarProvider
      date={selected}
      showTodayButton
      onDateChanged={date => setSelected(date)}
    >
      <ScrollView style={{ marginBottom: 75 }}>
        <ExpandableCalendar
          firstDay={1}
          markedDates={markedDates}
          onDayPress={day => setSelected(day.dateString)}
          theme={{
            backgroundColor: '#fff0f5',
            calendarBackground: '#fff0f5',
            textSectionTitleColor: '#ff69b4',
            selectedDayBackgroundColor: '#ff69b4',
            selectedDayTextColor: '#fff',
            todayTextColor: '#ff1493',
            dayTextColor: '#222',
            textDisabledColor: '#ffc0cb',
            dotColor: '#ff69b4',
            selectedDotColor: '#fff',
            arrowColor: '#ff69b4',
            monthTextColor: '#ff1493',
          }}
        />

        <View
          style={{
            padding: 15,
            paddingLeft: 7,
            margin: 16,
            marginBottom: 20,
            backgroundColor: '#FFF9F3',
            borderRadius: 20,
            shadowColor: '#AB8C8C',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          {/* Toggle Morning/Night */}
          <View style={styles.toggleWrapper}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                activeTab === 'Morning' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('Morning')}
            >
              <Icon1
                name="sun"
                size={20}
                color={activeTab === 'Morning' ? '#E07C8E' : '#DBABB3'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                activeTab === 'Night' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('Night')}
            >
              <Icon1
                name="moon"
                size={20}
                color={activeTab === 'Night' ? '#E07C8E' : '#DBABB3'}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{activeTab} Routine</Text>

          <FlatList
            data={currentData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => renderCard(item, activeTab)}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                No data available
              </Text>
            }
          />
        </View>
      </ScrollView>

      {/* Floating Bubble */}
      <TouchableOpacity
        style={styles.floatingBubble}
        onPress={() => navigation.navigate('EditRoutine')}
      >
        <Icon name="pencil" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Navbar */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <Navbar active={active} onPress={setActive} />
      </View>
    </CalendarProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF7F2' },
  headerContainer: {
    backgroundColor: '#FFF9F3',
    padding: 20,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    shadowColor: '#AB8C8C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  monthYearText: {
    marginLeft: 8,
    color: '#E07C8E',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  headerText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDone: {
    opacity: 0.8,
    backgroundColor: '#ED97A0',
    borderRadius: 12,
  },
  monthlyDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#FFFFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#030303ff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    marginTop: 40,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#F8D3D5',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 40,
  },
  productImage: {
    width: 50,
    height: 70,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    backgroundColor: '#000000ff',
    marginRight: 10,
  },
  toggleWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#F8D3D5',
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 15,
    shadowColor: '#AB8C8C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F8D3D5',
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: '#fff',
    borderRadius: 25,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#E06287',
    marginBottom: 40,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progress: {
    alignSelf: 'flex-end',
    backgroundColor: '#FDE5EB',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    color: '#E06287',
    marginBottom: 15,
  },
  remindTime: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    color: '#E06287',
  },
  remindTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: 10,
  },
  time: {
    marginRight: 8,
    fontWeight: 'light',
    color: '#D3586E',
    marginLeft: 5,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#FDE5EB',
    paddingRight: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    color: '#666',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  product: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#E06287',
    flexShrink: 1,
    maxWidth: 200,
    marginRight: 8,
  },
  exp: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'Poppins-Light',
    marginTop: 2,
  },
  floatingBubble: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#E07C8E',
    borderRadius: 60,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default Calendar;
