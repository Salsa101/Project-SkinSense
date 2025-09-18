import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Navbar from '../Components/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/FontAwesome5';

import api from '../api';

import { format, intervalToDuration } from 'date-fns';

import { useCustomBackHandler } from '../Handler/CustomBackHandler';

const Calendar = ({ navigation }) => {
  const [active, setActive] = useState('Calendar');
  const [activeTab, setActiveTab] = useState('Morning');
  const [morningTasks, setMorningTasks] = useState([]);
  const [nightTasks, setNightTasks] = useState([]);

  //Handler Back to Home
  useCustomBackHandler(() => {
    navigation.navigate('Home');
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resMorning = await api.get('/routine-products/view/morning');
        const resNight = await api.get('/routine-products/view/night');

        setMorningTasks(resMorning.data);
        setNightTasks(resNight.data);
      } catch (error) {
        console.error('Error fetching routines:', error);
      }
    };

    fetchData();
  }, []);

  // Real Time Date
  const getWeekDays = () => {
    const today = new Date();
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const currentDay = today.getDay();
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);

      return {
        day: dayNames[i],
        date: date.getDate(),
        isToday: date.toDateString() === today.toDateString(),
      };
    });
  };

  const DateItem = ({ day, date, isToday }) => (
    <View style={[styles.date, isToday && { backgroundColor: '#ED97A0' }]}>
      <Text
        style={{
          fontFamily: isToday ? 'Poppins-Bold' : 'Poppins-Medium',
          color: isToday ? 'white' : 'white',
        }}
      >
        {day}
      </Text>
      <Text
        style={{
          fontWeight: isToday ? 'Poppins-Bold' : 'Poppins-Medium',
          color: isToday ? 'white' : 'white',
        }}
      >
        {date}
      </Text>
    </View>
  );

  const today = new Date();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthYear = `${monthNames[today.getMonth()]}, ${today.getFullYear()}`;
  const weekDays = getWeekDays();

  const toggleDone = async (id, type) => {
    try {
      const res = await api.patch(`/routine-products/toggle-done`, {
        routineProductId: id,
      });

      const updatedTasks = res.data.map(t => ({
        ...t,
        done: t.doneStatus,
      }));

      const setter = type === 'Morning' ? setMorningTasks : setNightTasks;
      setter(updatedTasks);
    } catch (error) {
      console.error('Failed to toggle done:', error);
    }
  };

  const currentData = activeTab === 'Morning' ? morningTasks : nightTasks;

  const formatDuration = dur => {
    const parts = [];
    if (dur.years) parts.push(`${dur.years} yr`);
    if (dur.months) parts.push(`${dur.months} mo`);
    if (dur.days) parts.push(`${dur.days} d`);
    return parts.join(' ');
  };

  function safeDate(value, isTimeOnly = false) {
    if (!value) return null;

    if (isTimeOnly) {
      return new Date(`1970-01-01T${value}`);
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(`${value}T00:00:00`);
    }

    if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      const [day, month, year] = value.split('-');
      return new Date(`${year}-${month}-${day}T00:00:00`);
    }

    return new Date(value);
  }

  // Function to handle tab change & reset
  useEffect(() => {
    const checkTime = async () => {
      const hour = new Date().getHours();
      let newTab = hour >= 6 && hour < 18 ? 'Morning' : 'Night';
      setActiveTab(newTab);

      try {
        const res = await api.get(
          `/routine-products/view/${newTab.toLowerCase()}`,
        );
        const tasks = res.data.map(t => ({
          ...t,
          done: t.done || false,
        }));

        if (newTab === 'Morning') {
          setMorningTasks(tasks);
        } else {
          setNightTasks(tasks);
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const renderCard = (item, type) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, item.doneStatus && styles.cardDone]}
      onPress={() => toggleDone(item.id, type)}
    >
      <Text style={styles.time}>
        {safeDate(item.reminderTime, true)
          ? format(safeDate(item.reminderTime, true), 'HH:mm')
          : '-'}
      </Text>
      <View style={styles.infoBox}>
        <Image
          source={
            item.Product?.productImage
              ? { uri: `http://10.0.2.2:3000${item.Product.productImage}` }
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
          {safeDate(item.expirationDate) ? (
            new Date(item.expirationDate) <= new Date() ? (
              <Text style={[styles.exp, { color: 'red' }]}>
                Product Expired!
              </Text>
            ) : (
              (() => {
                const duration = intervalToDuration({
                  start: new Date(),
                  end: safeDate(item.expirationDate),
                });

                const totalMs =
                  safeDate(item.expirationDate).getTime() -
                  new Date().getTime();
                const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));

                if (totalDays <= 30) {
                  return (
                    <Text style={[styles.exp, { color: '#cf7f24ff' }]}>
                      Expiring Soon! ({totalDays} d)
                    </Text>
                  );
                }

                const parts = [];
                if (duration.years) parts.push(`${duration.years} yr`);
                if (duration.months) parts.push(`${duration.months} mo`);
                if (duration.days) parts.push(`${duration.days} d`);

                return <Text style={styles.exp}>Exp in {parts.join(' ')}</Text>;
              })()
            )
          ) : (
            <Text style={styles.exp}>-</Text>
          )}
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

  return (
    <View style={styles.container}>
      <ScrollView style={{ marginBottom: 75 }}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerText}>
            <Text
              style={{
                fontSize: 20,
                color: '#E07C8E',
                fontFamily: 'Poppins-Bold',
              }}
            >
              Skincare Tracker
            </Text>
            <View style={styles.monthlyDate}>
              <Icon name="calendar" size={15} color="#E07C8E" />
              <Text style={styles.monthYearText}>{monthYear}</Text>
            </View>
          </View>

          {/* Date */}
          <View style={styles.dateContainer}>
            {weekDays.map((d, i) => (
              <DateItem key={i} day={d.day} date={d.date} isToday={d.isToday} />
            ))}
          </View>
        </View>

        {/* Routine Panel */}
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
          {/* Toggle */}
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
          <Text style={styles.progress}>
            {currentData.filter(task => task.done).length}/{currentData.length}{' '}
            Completed
          </Text>

          {currentData.length === 0 ? (
            <Text
              style={{
                textAlign: 'center',
                marginVertical: 30,
                color: '#000000ff',
              }}
            >
              No data available
            </Text>
          ) : (
            currentData.map(item => renderCard(item, activeTab))
          )}
        </View>
      </ScrollView>

      {/* Floating Bubble Edit */}
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
    </View>
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
