import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';

import api from '../api';
import Navbar from '../Components/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';

import { useExitAppHandler } from '../Handler/CustomBackHandler';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [active, setActive] = useState('Home');

  const [infoHeight, setInfoHeight] = useState(0);

  const today = new Date();
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
  const todayStr = `${today.getDate()} ${monthNames[today.getMonth()]}`;

  const data = [
    {
      date: '19 Oct',
      items: [
        { title: 'Sunscreen', desc: 'Azarine 50 spf' },
        { title: 'Moisturizer', desc: 'Skintific Gel' },
      ],
    },
    {
      date: '22 Oct',
      items: [{ title: 'Serum', desc: 'Somethinc' }],
    },
  ];

  //Exit Handler
  useExitAppHandler();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/home', {
          withCredentials: true,
        });

        setUserData(response.data);
      } catch (err) {
        console.error(err);
        setError('Gagal mengambil data user. Silakan login kembali.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        style={{ flex: 1, justifyContent: 'center' }}
        size="large"
        color="#DE576F"
      />
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hello User */}
        <View style={styles.header}>
          <View>
            <Text style={styles.hello}>
              Hello, <Text style={styles.name}>Rosa</Text>
            </Text>
            <Text style={styles.subText}>Ready to your skin journey?</Text>
          </View>
          <Icon name="bell" size={22} color="#DE576F" />
        </View>

        {/* Latest Scan */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Your Latest Scan</Text>
            <TouchableOpacity>
              <Text style={styles.details}>See details</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.date}>2 days ago</Text>

          <View style={styles.scanRow}>
            <Image
              source={require('../../assets/product-image.png')}
              style={[styles.scanImage, { height: infoHeight }]}
              resizeMode="cover"
            />

            <View
              style={styles.info}
              onLayout={e => setInfoHeight(e.nativeEvent.layout.height)}
            >
              <View style={[styles.infoBox, { marginBottom: 10 }]}>
                <Text
                  style={styles.label}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Skin Type
                </Text>
                <Text
                  style={styles.value}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Combination
                </Text>
              </View>
              <View style={[styles.infoBox, { marginBottom: 10 }]}>
                <Text
                  style={styles.label}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Acne Spot
                </Text>
                <Text
                  style={styles.value}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  5
                </Text>
              </View>
              <View style={styles.infoBox}>
                <Text
                  style={styles.label}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Severity
                </Text>
                <Text
                  style={styles.value}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Medium
                </Text>
              </View>
              <View style={styles.infoBox}>
                <Text
                  style={styles.label}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Score
                </Text>
                <Text
                  style={[styles.value, { color: '#DE576F' }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  90/100
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Compare Scan */}
        <TouchableOpacity
          style={styles.compareButton}
          onPress={() => navigation.navigate('CompareScan')}
        >
          <View style={styles.compareContent}>
            <View style={styles.iconCircle}>
              <Icon1 name="scan" size={18} color="#F8CED5" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.compareTitle}>Compare Scan</Text>
              <Text style={styles.compareDesc}>Compare your result scan</Text>
            </View>
            <Icon1 name="chevron-forward" size={20} color="#DE576F" />
          </View>
        </TouchableOpacity>

        {/* Reminder Card */}
        <TouchableOpacity style={styles.reminderCard}>
          <ImageBackground
            source={require('../../assets/news1.jpg')}
            style={styles.reminderImage}
            imageStyle={{ borderRadius: 12 }}
          >
            <View style={styles.overlay}>
              <View style={styles.contentColumn}>
                <View style={styles.topRow}>
                  <Icon2 name="sun" size={20} color="#fff" />
                  <View style={styles.textColumn}>
                    <Text style={styles.progressText}>0/5 Completed</Text>
                    <Text style={styles.title}>
                      End your day properly with your night routine
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.arrowContainer}>
                <Icon name="long-arrow-right" size={20} color="#fff" />
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Expired Upcoming */}
        <View style={styles.expiredUpcoming}>
          <Text style={styles.expiredUpcomingTitle}>
            Upcoming Product Expiry
          </Text>
          {data.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text
                style={[
                  styles.expiredDate,
                  sectionIndex === 0 && { marginTop: 0 },
                ]}
              >
                {section.date}
              </Text>
              <View
                style={[
                  styles.line,
                  section.date === todayStr && { backgroundColor: '#DE576F' },
                ]}
              />

              <View
                style={[
                  styles.rightColumn,
                  sectionIndex === 0 && { marginTop: 0 },
                ]}
              >
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.expiredCard}>
                    <View style={styles.row}>
                      <View>
                        <Text style={styles.expiredTitle}>{item.title}</Text>
                        <Text style={styles.desc}>{item.desc}</Text>
                      </View>
                      <Icon2
                        name="prescription-bottle"
                        size={18}
                        color="#DE576F"
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Tips Skincare */}
        <View style={styles.expiredUpcoming}>
          <Text style={styles.expiredUpcomingTitle}>Tips for You</Text>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <Navbar active={active} onPress={setActive} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF7F2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  hello: {
    fontSize: 22,
    color: '#333',
    fontWeight: '400',
  },
  name: {
    fontWeight: '700',
    color: '#DE576F',
  },
  subText: {
    color: '#A77B7B',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#FCE6E9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  details: {
    fontSize: 13,
    color: '#DE576F',
  },
  date: {
    color: '#A77B7B',
    fontSize: 12,
    marginTop: 4,
  },
  scanRow: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'flex-start',
  },
  scanImage: {
    width: 90,
    borderRadius: 12,
    marginRight: 12,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoBox: {
    width: '48%',
    backgroundColor: '#FFF0F3',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    color: '#A77B7B',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  compareButton: {
    backgroundColor: '#FCE6E9',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  compareContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DE576F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compareTitle: {
    fontWeight: '600',
    fontSize: 15,
    color: '#333',
  },
  compareDesc: {
    fontSize: 12,
    color: '#A77B7B',
    marginRight: 10,
  },
  reminderCard: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginVertical: 10,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  reminderImage: {
    flex: 1,
    justifyContent: 'space-between',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
    padding: 20,
  },
  contentColumn: {
    flexDirection: 'column',
    gap: 5,
  },
  topRow: {
    flexDirection: 'row',
    gap: 8,
  },
  textColumn: {
    marginLeft: 5,
    flex: 1,
  },
  progressText: {
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    marginRight: 20,
    lineHeight: 25,
  },
  arrowContainer: {
    alignSelf: 'flex-end',
  },

  expiredUpcoming: {
    marginVertical: 20,
  },
  expiredUpcomingTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 25,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  expiredDate: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    marginTop: 25,
  },
  line: {
    width: 2,
    backgroundColor: '#ccc',
    alignSelf: 'stretch',
    marginHorizontal: 15,
  },
  rightColumn: {
    flex: 1,
    gap: 8,
    marginTop: 25,
  },
  expiredCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  expiredTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  desc: {
    fontSize: 13,
    color: '#666',
  },
});

export default HomeScreen;
