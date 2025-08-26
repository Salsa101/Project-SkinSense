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

const Calendar = ({ navigation }) => {
  const [active, setActive] = useState('Calendar');
  const [activeTab, setActiveTab] = useState('Morning');

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
    <View style={[styles.date, isToday && { backgroundColor: '#d87bbfff' }]}>
      <Text
        style={{ fontFamily: isToday ? 'Poppins-Bold' : 'Poppins-Regular' }}
      >
        {day}
      </Text>
      <Text
        style={{ fontWeight: isToday ? 'Poppins-Bold' : 'Poppins-Regular' }}
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

  const morningData = [
    {
      id: 1,
      order: 1,
      step: 'Step 1: Cleanser',
      product: 'Azarine Sunscreen Gel',
      exp: 'Exp in 1 yr 2 mo 3 days',
      done: false,
      date: '08:00',
      image: require('../../assets/product-image.png'),
    },
    {
      id: 2,
      order: 2,
      step: 'Step 2: Cleanser',
      product: 'Azarine Sunscreen Gel',
      exp: 'Exp in 1 yr 2 mo 3 days',
      done: false,
      date: '08:05',
      image: require('../../assets/product-image.png'),
    },
    {
      id: 3,
      order: 3,
      step: 'Step 3: Cleanser',
      product: 'Azarine Sunscreen Gel',
      exp: 'Exp in 1 yr 2 mo 3 days',
      done: false,
      date: '08:10',
      image: require('../../assets/product-image.png'),
    },
    {
      id: 4,
      order: 4,
      step: 'Step 4: Cleanser',
      product: 'Azarine Sunscreen Gel',
      exp: 'Exp in 1 yr 2 mo 3 days',
      done: false,
      date: '08:15',
      image: require('../../assets/product-image.png'),
    },
    {
      id: 5,
      order: 5,
      step: 'Step 5: Cleanser',
      product: 'Azarine Sunscreen Gel',
      exp: 'Exp in 1 yr 2 mo 3 days',
      done: false,
      date: '08:20',
      image: require('../../assets/product-image.png'),
    },
    {
      id: 6,
      order: 6,
      step: 'Step 6: Cleanser',
      product: 'Azarine Sunscreen Gel',
      exp: 'Exp in 1 yr 2 mo 3 days',
      done: false,
      date: '08:25',
      image: require('../../assets/product-image.png'),
    },
  ];

  const nightData = [
    {
      id: 1,
      order: 1,
      step: 'Step 1: Cleanser',
      product: 'Wardah Facial Wash',
      exp: 'Exp in 1 yr 1 mo 10 days',
      done: false,
      date: '20:00',
      image: require('../../assets/product-placeholder.jpg'),
    },
    {
      id: 2,
      order: 2,
      step: 'Step 2: Toner',
      product: 'Some By Mi Toner',
      exp: 'Exp in 8 mo 12 days',
      done: false,
      date: '20:05',
      image: require('../../assets/product-placeholder.jpg'),
    },
    {
      id: 3,
      order: 3,
      step: 'Step 3: Serum',
      product: 'The Ordinary Serum',
      exp: 'Exp in 11 mo 7 days',
      done: false,
      date: '20:10',
      image: require('../../assets/product-placeholder.jpg'),
    },
  ];

  //Toggle Done Status
  const [morningTasks, setMorningTasks] = useState(morningData);
  const [nightTasks, setNightTasks] = useState(nightData);

  const toggleDone = (id, type) => {
    const setter = type === 'Morning' ? setMorningTasks : setNightTasks;
    const tasks = type === 'Morning' ? morningTasks : nightTasks;

    setter(
      tasks
        .map(task => (task.id === id ? { ...task, done: !task.done } : task))
        .sort((a, b) => {
          if (a.done === b.done) {
            return a.order - b.order;
          }
          return a.done ? 1 : -1;
        }),
    );
  };

  const currentData = activeTab === 'Morning' ? morningTasks : nightTasks;

  // Function to handle tab change & reset
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      let newTab = hour >= 6 && hour < 18 ? 'Morning' : 'Night';

      setActiveTab(newTab);

      if (newTab === 'Morning') {
        setMorningTasks(morningData.map(t => ({ ...t, done: false })));
      } else {
        setNightTasks(nightData.map(t => ({ ...t, done: false })));
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const renderCard = (item, type) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, item.done && styles.cardDone]}
      onPress={() => toggleDone(item.id, type)}
    >
      <Text style={styles.time}>{item.date}</Text>
      <View style={styles.infoBox}>
        {item.image && (
          <Image source={item.image} style={styles.productImage} />
        )}
        <View style={styles.info}>
          <Text style={styles.step}>{item.step}</Text>
          <Text style={styles.product}>{item.product}</Text>
          <Text style={styles.exp}>{item.exp}</Text>
        </View>
        <Icon
          name={item.done ? 'check-circle' : 'circle-o'}
          size={22}
          color={item.done ? '#ac4cafff' : '#dea9d1ff'}
          style={{ marginLeft: 'auto' }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={{ marginBottom: 90 }}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerText}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              Skincare Tracker
            </Text>
            <View style={styles.monthlyDate}>
              <Icon name="calendar" size={20} color="#000000" />
              <Text style={{ marginHorizontal: 8 }}>{monthYear}</Text>
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
            margin: 18,
            backgroundColor: '#b4b4b4ff',
            borderRadius: 20,
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
                color={activeTab === 'Morning' ? 'orange' : 'gray'}
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
                color={activeTab === 'Night' ? 'blue' : 'gray'}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{activeTab} Routine</Text>
          <Text style={styles.progress}>
            {currentData.filter(task => task.done).length}/{currentData.length}{' '}
            Completed
          </Text>

          {currentData.map(item => renderCard(item, activeTab))}
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
  container: { flex: 1 },
  headerContainer: {
    backgroundColor: 'lightgray',
    padding: 20,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  headerText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDone: {
    opacity: 0.8,
    backgroundColor: '#f5a7f5ff',
    borderRadius: 12,
  },
  monthlyDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    marginTop: 40,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
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
    backgroundColor: '#8f4141ff',
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 15,
  },
  toggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#8f4141ff',
    borderRadius: 25,
  },
  toggleText: {
    fontSize: 14,
    color: '#999',
  },
  activeTab: {
    backgroundColor: '#fff',
    borderRadius: 25,
  },
  activeText: {
    color: '#E06287',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E06287',
    marginBottom: 40,
    textAlign: 'center',
  },
  progress: {
    alignSelf: 'flex-end',
    backgroundColor: '#FDE5EB',
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
    width: 60,
    marginRight: 0,
    fontWeight: 'bold',
    color: '#666',
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
    fontSize: 12,
  },
  product: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E06287',
  },
  exp: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    marginTop: 8,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 'auto',
  },
  statusText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
  },
  floatingBubble: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: '#ae02c9ff',
    borderRadius: 40,
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
