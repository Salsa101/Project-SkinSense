import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import { parse, format, intervalToDuration } from 'date-fns';

import LinearGradient from 'react-native-linear-gradient';

import api from '../api';
import Navbar from '../Components/Navbar';

import { useCustomBackHandler } from '../Handler/CustomBackHandler';

import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Calendar = ({ navigation }) => {
  //Handler Back to Home
  useCustomBackHandler(() => {
    navigation.navigate('Home');
  });

  const [selected, setSelected] = useState(
    new Date().toISOString().split('T')[0],
  );

  const initialTab = (() => {
    const hours = new Date().getHours();
    return hours >= 6 && hours < 18 ? 'Morning' : 'Night';
  })();

  const [activeTab, setActiveTab] = useState(initialTab);

  const [morningTasks, setMorningTasks] = useState([]);
  const [nightTasks, setNightTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('Calendar');

  const [journal, setJournal] = useState(null);
  const [mood, setMood] = useState(null);

  const [allJournals, setAllJournals] = useState([]);

  const [progress, setProgress] = useState(null);

  const moodMap = ['cry', 'sad', 'neutral', 'happy', 'excited'];

  const moodIcons = [
    { lib: Icon1, name: 'sad-cry' }, // cry
    { lib: Icon, name: 'frown-o' }, // sad
    { lib: Icon, name: 'meh-o' }, // neutral
    { lib: Icon, name: 'smile-o' }, // happy
    { lib: Icon1, name: 'smile-beam' }, // excited
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resJournal = await api.get('/journal/view', {
          params: { date: selected },
        });

        setJournal(resJournal.data || null);

        if (resJournal.data?.mood) {
          setMood(resJournal.data.mood);
        }

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

  useEffect(() => {
    const fetchJournalsByMonth = async () => {
      try {
        const res = await api.get('/journal/month', {
          params: { month: selected.slice(0, 7) }, // "YYYY-MM"
        });
        setAllJournals(res.data || []);
      } catch (err) {
        console.error('Fetch journals error:', err);
      }
    };

    fetchJournalsByMonth();
  }, [selected]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get('/routine-progress', {
          withCredentials: true,
        });
        if (res.data.success) {
          setProgress(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch routine progress:', err);
      }
    };

    fetchProgress();
  }, []);

  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour < 18;

  const markedDates = useMemo(() => {
    const marks = {};

    allJournals.forEach(journal => {
      const date = journal.journal_date.split('T')[0];
      marks[date] = {
        dots: [{ color: '#E07C8E' }],
        ...(date === selected && {
          selected: true,
          selectedColor: '#E07C8E',
          selectedTextColor: '#fff',
        }),
      };
    });

    if (!marks[selected]) {
      marks[selected] = {
        selected: true,
        selectedColor: '#E07C8E',
        selectedTextColor: '#fff',
      };
    }

    return marks;
  }, [allJournals, selected]);

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

  const [reminders, setReminders] = useState({ morning: null, night: null });

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await api.get('/reminder-times/view');
        const data = res.data || [];
        const morning = data.find(r => r.timeOfDay === 'morning');
        const night = data.find(r => r.timeOfDay === 'night');
        setReminders({ morning, night });
      } catch (err) {
        console.error('Failed to fetch reminders:', err);
      }
    };

    fetchReminders();
  }, []);

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
              ? { uri: item.Product.productImage }
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
              : ''}{' '}
            •{' '}
            {item.routineType.charAt(0).toUpperCase() +
              item.routineType.slice(1)}
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
          markingType="multi-dot"
          onDayPress={day => setSelected(day.dateString)}
          theme={{
            backgroundColor: '#FFF9F3',
            calendarBackground: '#FFF9F3',
            textSectionTitleColor: '#E07C8E',
            selectedDayBackgroundColor: '#E07C8E',
            selectedDayTextColor: '#fff',
            todayTextColor: '#E07C8E',
            dayTextColor: '#915b5bff',
            textDisabledColor: '#ffc0cb',
            dotColor: '#E07C8E',
            selectedDotColor: '#fff',
            arrowColor: '#E07C8E',
            monthTextColor: '#E07C8E',
          }}
        />

        {/* Journal Section */}
        {!journal ? (
          // Journal Null
          <View style={styles.journalContainer}>
            <View style={styles.journalContent}>
              <View style={styles.journalTextContainer}>
                <Text style={styles.journalTitle}>Journal</Text>
                <Text style={styles.journalSubtitle}>
                  Add journal to track your skin progress
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('AddJournal', { date: selected })
                  }
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#F8D3D4', '#ED97A0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.journalButton}
                  >
                    <View style={styles.journalButtonContent}>
                      <Text style={styles.journalButtonText1}>
                        Add today's journal
                      </Text>
                      <Icon name="long-arrow-right" size={12} color="#fff" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <Image
                source={require('../../assets/journal.png')}
                style={styles.journalImage}
                resizeMode="contain"
              />
            </View>
          </View>
        ) : (
          // JOURNAL VIEW
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('JournalDetail', { id: journal.id })
            }
          >
            <LinearGradient
              colors={['#FFF9F3', '#F8D3D5', '#EDB3BC', '#E08898']}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.journalContainer}
            >
              <View style={styles.journalContent}>
                <Image
                  source={
                    journal?.journal_image
                      ? {
                          uri: journal.journal_image,
                        }
                      : require('../../assets/journal.png')
                  }
                  style={styles.journalImage2}
                  resizeMode="cover"
                />

                <View style={styles.journalTextContainer}>
                  <View style={styles.journalButton1}>
                    <View style={styles.journalButtonContent1}>
                      <Text style={styles.journalButtonText1}>
                        {new Date(journal.journal_date).toDateString()}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={styles.journalTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {journal.title}
                  </Text>

                  <Text
                    style={styles.journalSubtitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {journal.description}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: '#FFF9F3',
                    borderRadius: 30,
                    padding: 7,
                    marginLeft: 20,
                    marginRight: 8,
                    shadowColor: 'rgba(95, 52, 52, 1)',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  {journal?.mood &&
                    (() => {
                      const moodValue = journal.mood;
                      const moodIndex = moodMap.indexOf(moodValue);
                      if (moodIndex !== -1) {
                        const IconLib = moodIcons[moodIndex].lib;
                        const iconName = moodIcons[moodIndex].name;
                        return (
                          <IconLib name={iconName} size={30} color="#E07C8E" />
                        );
                      }
                      return null;
                    })()}
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Routine Section Container */}
        <View style={styles.routineContainer}>
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

          <View style={styles.progressContainer}>
            <View style={styles.remindTimeContainer}>
              <Icon name="clock-o" size={20} color="#E07C8E" />
              <Text style={styles.remindTime}>
                {activeTab === 'Morning'
                  ? reminders.morning?.reminderTime
                    ? format(
                        parse(
                          reminders.morning.reminderTime,
                          'HH:mm:ss',
                          new Date(),
                        ),
                        'HH:mm',
                      )
                    : 'Reminder'
                  : reminders.night?.reminderTime
                  ? format(
                      parse(
                        reminders.night.reminderTime,
                        'HH:mm:ss',
                        new Date(),
                      ),
                      'HH:mm',
                    )
                  : 'Reminder'}
              </Text>
            </View>
            <Text style={styles.progress}>
              {isDaytime
                ? `${progress?.morning?.done ?? 0}/${
                    progress?.morning?.total ?? 0
                  } Completed`
                : `${progress?.night?.done ?? 0}/${
                    progress?.night?.total ?? 0
                  } Completed`}
            </Text>
          </View>

          <View>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <View key={index}>{renderCard(item, activeTab)}</View>
              ))
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 20,
                  fontFamily: 'Poppins-Regular',
                  color: '#915b5bff',
                }}
              >
                No data available
              </Text>
            )}
          </View>
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
  // style journal
  journalContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingLeft: 25,
    margin: 16,
    marginTop: 20,
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
  },
  journalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  journalTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  journalTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#E07C8E',
    marginBottom: 4,
  },
  journalSubtitle: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#B67F89',
    marginBottom: 10,
    lineHeight: 14,
  },
  journalButton: {
    backgroundColor: '#E07C8E',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  journalButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  journalButtonText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
  },
  journalImage: {
    width: 135,
    height: 100,
    marginRight: -10,
  },
  journalImage2: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 10,
    marginLeft: -5,
    marginRight: 10,
  },
  journalButton1: {
    backgroundColor: '#E07C8E',
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  journalButtonContent1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  journalButtonText1: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
  },
  //style routine
  routineContainer: {
    padding: 15,
    paddingLeft: 7,
    margin: 16,
    marginTop: 0,
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
  routineWrapper: {
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
  },
});

export default Calendar;
