import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import { format, intervalToDuration } from 'date-fns';

import api from '../api';
import { useCustomBackHandler } from '../Handler/CustomBackHandler';

import ReminderTimePicker from '../Components/ReminderTime';

const EditRoutine = ({ navigation, route }) => {
  const [active, setActive] = useState('Calendar');
  const [activeTab, setActiveTab] = useState('Morning');
  const [activeRoutineTab, setActiveRoutineTab] = useState('Daily');
  const [routineData, setRoutineData] = useState([]);
  const { targetTab, targetRoutine, productId } = route.params || {};

  const [reminderTimes, setReminderTimes] = useState({
    morning: null,
    night: null,
  });

  //Handler Back to Home
  useCustomBackHandler(() => {
    navigation.navigate('Calendar');
  });

  const fetchRoutine = async () => {
    try {
      const response = await api.get(
        `/routine-products/view/${activeRoutineTab.toLowerCase()}/${activeTab.toLowerCase()}`,
      );
      setRoutineData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoutine();
  }, [activeRoutineTab, activeTab]);

  const currentData = [...routineData].sort((a, b) => {
    return Number(a.productStep) - Number(b.productStep);
  });

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

  const handleDelete = routineProductId => {
    Alert.alert(
      'Delete Routine',
      'Are you sure you want to delete this routine?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete('/routine-products/delete', {
                data: { routineProductId },
              });
              fetchRoutine();
            } catch (err) {
              console.error(err);
            }
          },
        },
      ],
    );
  };

  const fetchReminderTimes = async () => {
    try {
      const res = await api.get('/reminder-times/view');
      const mapped = {};
      res.data.forEach(r => {
        mapped[r.timeOfDay] = r;
      });

      setReminderTimes(mapped);

      // Auto-create missing reminders
      const missing = ['morning', 'night'].filter(time => !mapped[time]);
      if (missing.length > 0) {
        await Promise.all(
          missing.map(time =>
            api.post('/reminder-times/add', {
              timeOfDay: time,
              reminderTime: '', // kosongkan
            }),
          ),
        );

        // Fetch lagi setelah semua selesai
        const res2 = await api.get('/reminder-times/view');
        const mapped2 = {};
        res2.data.forEach(r => {
          mapped2[r.timeOfDay] = r;
        });
        setReminderTimes(mapped2);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReminderTimes();
  }, []);

  useEffect(() => {
    if (targetTab) {
      setActiveTab(targetTab.charAt(0).toUpperCase() + targetTab.slice(1)); // morning → Morning
    }
    if (targetRoutine) {
      setActiveRoutineTab(
        targetRoutine.charAt(0).toUpperCase() + targetRoutine.slice(1),
      );
    }
  }, [targetTab, targetRoutine]);

  const renderCard = item => (
    <View key={item.id} style={[styles.card, item.done && styles.cardDone]}>
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
          <Text style={styles.product} numberOfLines={1} ellipsizeMode="tail">
            {item.Product?.productName}
          </Text>

          <Text style={styles.step}>
            Step {item.productStep} ·{' '}
            {item.Product?.productType
              ? item.Product.productType.charAt(0).toUpperCase() +
                item.Product.productType.slice(1)
              : ''}
          </Text>
          <Text style={styles.exp}>
            {safeDate(item.dateOpened)
              ? `Opened at ${format(safeDate(item.dateOpened), 'dd MMM yyyy')}`
              : 'Not Yet Opened'}
          </Text>

          <Text style={styles.exp}>
            Exp at{' '}
            {safeDate(item.expirationDate)
              ? format(safeDate(item.expirationDate), 'dd MMM yyyy')
              : '-'}
          </Text>

          {item.routineType !== 'daily' && (
            <Text style={styles.exp}>
              Reminder on{' '}
              {item.routineType === 'weekly' && item.dayOfWeek
                ? item.dayOfWeek
                    .map(
                      d =>
                        d.slice(0, 3).charAt(0).toUpperCase() + d.slice(1, 3),
                    )
                    .join(', ')
                : item.routineType === 'custom' && item.customDate
                ? new Date(item.customDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : ''}
            </Text>
          )}
        </View>
        <View style={{ marginLeft: 'auto', gap: 10, marginRight: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProduct', { id: item.id })}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 30,
              padding: 7,
              shadowColor: 'rgba(95, 52, 52, 1)',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Icon name="pencil" size={18} color="#E07C8E" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 30,
              padding: 7,
              shadowColor: 'rgba(95, 52, 52, 1)',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Icon name="trash" size={18} color="#E07C8E" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 20,
              color: '#E07C8E',
            }}
          >
            My Skincare Routine
          </Text>

          <View style={styles.routineToggleWrapper}>
            {['Daily', 'Weekly', 'Custom'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.routineToggleButton,
                  activeRoutineTab === tab && styles.activeRoutineTab,
                ]}
                onPress={() => setActiveRoutineTab(tab)}
              >
                <Text
                  style={{
                    color: activeRoutineTab === tab ? '#fff' : '#B67F89',
                    fontFamily: 'Poppins-Bold',
                    fontSize: 14,
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View
          style={{
            padding: 15,
            margin: 16,
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
          <TouchableOpacity onPress={() => navigation.navigate('AddProduct')}>
            <Text style={styles.progress}>+ Add Product</Text>
          </TouchableOpacity>

          {/* Reminder Picker */}
          {activeTab === 'Morning' && (
            <ReminderTimePicker
              timeOfDay="morning"
              reminder={reminderTimes.morning}
              fetchReminders={fetchReminderTimes}
            />
          )}
          {activeTab === 'Night' && (
            <ReminderTimePicker
              timeOfDay="night"
              reminder={reminderTimes.night}
              fetchReminders={fetchReminderTimes}
            />
          )}

          {currentData.length === 0 ? (
            <Text
              style={{
                textAlign: 'center',
                marginVertical: 30,
                color: '#B67F89',
                fontFamily: 'Poppins-Medium',
                fontSize: 11,
              }}
            >
              No data available
            </Text>
          ) : (
            currentData.map(item => renderCard(item))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  routineToggleWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#F8D3D5',
    borderRadius: 25,
    marginTop: 15,
    marginBottom: 10,
    overflow: 'hidden',
    boxShadow: '0px 2px 4px rgba(170, 162, 162, 0.3)',
  },
  routineToggleButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F8D3D5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeRoutineTab: {
    backgroundColor: '#E07C8E',
  },
  container: {
    flex: 1,
    backgroundColor: '#FCF7F2',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cardDone: {
    opacity: 0.8,
    backgroundColor: '#E07C8E',
    borderRadius: 12,
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
    width: 65,
    height: 105,
    borderRadius: 5,
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 12,
    color: '#E06287',
    marginBottom: 15,
    fontFamily: 'Poppins-Bold',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#FDE5EB',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    color: '#4d4c4cff',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginTop: 2,
  },
  product: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E06287',
    flexShrink: 1,
    maxWidth: 200,
    marginRight: 8,
  },
  exp: {
    fontSize: 11,
    color: '#726b6bff',
    marginTop: 2,
    fontFamily: 'Poppins-Medium',
  },
  info: {
    flex: 1,
  },
});

export default EditRoutine;
