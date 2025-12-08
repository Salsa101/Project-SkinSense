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

import { notification } from '../Handler/Notification.js';

import { useExitAppHandler } from '../Handler/CustomBackHandler';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [active, setActive] = useState('Home');
  const [latestScan, setLatestScan] = useState(null);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [weeklyNews, setWeeklyNews] = useState(null);
  const [bookmarked, setBookmarked] = useState({});
  const [progress, setProgress] = useState(null);

  const [infoHeight, setInfoHeight] = useState(0);

  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour < 18;

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

  useEffect(() => {
    const fetchLatestScan = async () => {
      try {
        const res = await api.get('/latest-scan', {
          withCredentials: true,
        });
        setLatestScan(res.data);
      } catch (error) {
        if (error.response?.status === 404) {
          setLatestScan(null);
        } else {
          console.error('Error fetching latest scan:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLatestScan();
  }, []);

  useEffect(() => {
    const fetchExpiring = async () => {
      try {
        const res = await api.get('/product-expired', {
          withCredentials: true,
        });
        if (res.data.success) {
          const formattedData = res.data.data.map(product => ({
            date: new Date(product.expirationDate).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
            }),
            items: [
              {
                title: product.Product.productName,
                desc: product.Product.productType || '',
                timeOfDay: product.timeOfDay,
                routineType: product.routineType,
                id: product.id,
              },
            ],
          }));
          setExpiringProducts(formattedData);
        }
      } catch (err) {
        console.error('Error fetching expiring products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpiring();
  }, []);

  useEffect(() => {
    const fetchWeeklyNews = async () => {
      try {
        const res = await api.get('/weekly-tips', { withCredentials: true });
        if (res.data.success) {
          setWeeklyNews(res.data.data);
        } else {
          setWeeklyNews(null);
        }
      } catch (err) {
        console.error('Error fetching weekly news:', err);
        setWeeklyNews(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyNews();
  }, []);

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

  const getTimeAgo = createdAt => {
    const created = new Date(createdAt);
    const today = new Date();
    const diffDays = Math.floor((today - created) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const toggleBookmark = async newsId => {
    try {
      if (bookmarked[newsId]) {
        await api.delete(`/news/${newsId}/bookmark`);
        setBookmarked(prev => ({ ...prev, [newsId]: false }));
      } else {
        await api.post(`/news/${newsId}/bookmark`);
        setBookmarked(prev => ({ ...prev, [newsId]: true }));
      }
    } catch (err) {
      console.error(err);
      alert('Gagal update bookmark ❌');
    }
  };

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

  const klikNotif = () => {
    notification.configure();
    notification.buatChannel('1');
    notification.kirimNotifikasiJadwal(
      '1',
      'New Notification',
      'This is a new notification',
    );
  };

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
              Hello, <Text style={styles.name}>{userData?.user?.username}</Text>
            </Text>
            <Text style={styles.subText}>Ready to your skin journey?</Text>
          </View>
          {/* <TouchableOpacity onPress={klikNotif}>
            <Icon name="bell" size={22} color="#DE576F" />
          </TouchableOpacity> */}
        </View>

        {/* Latest Scan */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Your Latest Scan</Text>
            {latestScan && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('HistoryScan', {
                    date: latestScan?.createdAt,
                  })
                }
              >
                <Text style={styles.details}>See details</Text>
              </TouchableOpacity>
            )}
          </View>

          {latestScan ? (
            <>
              <Text style={styles.date}>
                {getTimeAgo(latestScan?.createdAt)}
              </Text>

              <View style={styles.scanRow}>
                {latestScan?.imagePath ? (
                  <Image
                    source={{
                      uri: latestScan.imagePath,
                    }}
                    style={[styles.scanImage, { height: infoHeight }]}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require('../../assets/journal.png')}
                    style={[styles.scanImage, { height: infoHeight }]}
                    resizeMode="contain"
                  />
                )}

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
                      {latestScan?.skinType || '-'}
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
                      {latestScan?.acneCount ?? 0}
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
                      {latestScan?.severity || '-'}
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
                      {latestScan?.score || '-'}%
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.emptyScan}>
              <Image
                source={require('../../assets/journal.png')}
                style={styles.emptyImage}
                resizeMode="contain"
              />
              <View style={styles.emptyTextContainer}>
                <Text style={styles.emptyTitle}>Let's scan your face!</Text>
                <Text style={styles.emptyDesc}>
                  Discover recommendation product just for You.
                </Text>
                <TouchableOpacity
                  style={styles.scanButton}
                  onPress={() => navigation.navigate('LandingPage')}
                >
                  <Text style={styles.scanButtonText}>Scan Face</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
        <TouchableOpacity
          style={styles.reminderCard}
          onPress={() => navigation.navigate('Calendar')}
        >
          <ImageBackground
            source={require('../../assets/news1.jpg')}
            style={styles.reminderImage}
            imageStyle={{ borderRadius: 12 }}
          >
            <View style={styles.overlay}>
              <View style={styles.contentColumn}>
                <View style={styles.topRow}>
                  {isDaytime ? (
                    <Icon2 name="sun" size={20} color="#fff" />
                  ) : (
                    <Icon2 name="moon" size={20} color="#fff" />
                  )}
                  <View style={styles.textColumn}>
                    <Text style={styles.progressText}>
                      {isDaytime
                        ? `${progress?.morning?.done ?? 0}/${
                            progress?.morning?.total ?? 0
                          } Completed`
                        : `${progress?.night?.done ?? 0}/${
                            progress?.night?.total ?? 0
                          } Completed`}
                    </Text>
                    <Text style={styles.title}>
                      {isDaytime
                        ? 'Begin your day with your morning routine'
                        : 'End your day properly with your night routine'}
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

          {expiringProducts.length > 0 ? (
            expiringProducts.map((section, sectionIndex) => (
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
                    <TouchableOpacity
                      key={item.id || itemIndex}
                      onPress={() => {
                        console.log('ITEM DATA =>', item);
                        navigation.navigate('EditRoutine', {
                          targetTab: item.timeOfDay,
                          targetRoutine: item.routineType,
                          productId: item.id,
                        });
                      }}
                    >
                      <View key={itemIndex} style={styles.expiredCard}>
                        <View style={styles.row}>
                          <View style={{ flexShrink: 1, marginRight: 15 }}>
                            <Text
                              style={styles.expiredTitle}
                              numberOfLines={2}
                              ellipsizeMode="tail"
                            >
                              {item.title}
                            </Text>
                            <Text
                              style={styles.desc}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {item.desc.charAt(0).toUpperCase() +
                                item.desc.slice(1)}
                            </Text>
                          </View>
                          <Icon2
                            name="prescription-bottle"
                            size={18}
                            color="#DE576F"
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyBox}>
              <View style={{ flex: 1 }}>
                <Text style={styles.emptyTitle}>You're all set!</Text>
                <Text style={styles.emptyDescExpiry}>
                  There are no products nearing expiry
                </Text>
              </View>

              <Image
                source={require('../../assets/expiry-placeholder.png')}
                style={styles.emptyImageExpiry}
                resizeMode="contain"
              />
            </View>
          )}
        </View>

        {/* Tips Skincare */}
        <View style={styles.tipsSkincare}>
          <Text style={styles.expiredUpcomingTitle}>Tips for You</Text>

          {weeklyNews ? (
            <TouchableOpacity
              style={styles.newscard}
              onPress={() =>
                navigation.navigate('NewsDetail', { id: weeklyNews.id })
              }
              activeOpacity={0.8}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={
                    weeklyNews.newsImage
                      ? {
                          uri: weeklyNews.newsImage,
                        }
                      : require('../../assets/category-admin.jpg')
                  }
                  style={styles.image}
                />
                <TouchableOpacity
                  style={styles.bookmarkBtn}
                  onPress={() => toggleBookmark(weeklyNews.id)}
                >
                  <Icon
                    name={bookmarked[weeklyNews.id] ? 'bookmark' : 'bookmark-o'}
                    size={24}
                    color="#E07C8E"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <Text style={styles.newsTitle}>{weeklyNews.title}</Text>
                <View style={styles.categoryContainer}>
                  {weeklyNews.Categories?.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.categoryBadge}
                      onPress={() =>
                        navigation.navigate('CategoryNews', {
                          categoryId: category.id,
                          categoryName: category.name,
                        })
                      }
                    >
                      <Text style={styles.categoryText}>{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <Text>No news available this week</Text>
          )}
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
    color: '#DE576F',
    fontFamily: 'Poppins-Light',
  },
  name: {
    fontFamily: 'Poppins-Bold',
    color: '#DE576F',
  },
  subText: {
    color: '#DE576F',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
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
    fontFamily: 'Poppins-SemiBold',
    color: '#DE576F',
  },
  details: {
    fontSize: 13,
    color: '#DE576F',
  },
  date: {
    color: '#DE576F',
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
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#DE576F',
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
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#DE576F',
  },
  compareDesc: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
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
    fontFamily: 'Poppins-Bold',
    marginRight: 20,
    lineHeight: 25,
  },
  arrowContainer: {
    alignSelf: 'flex-end',
  },

  expiredUpcoming: {
    marginTop: 15,
    marginBottom: 25,
  },
  expiredUpcomingTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#DE576F',
    marginBottom: 25,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  expiredDate: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#DE576F',
    marginTop: 25,
  },
  line: {
    width: 2,
    backgroundColor: '#EB889A',
    alignSelf: 'stretch',
    marginHorizontal: 15,
  },
  rightColumn: {
    flex: 1,
    gap: 8,
    marginTop: 25,
  },
  expiredCard: {
    backgroundColor: '#FFF0F3',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#974343',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  expiredTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#DE576F',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  desc: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#A77B7B',
  },
  newscard: {
    backgroundColor: '#FFF0F3',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
  },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 140 },
  bookmarkBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    elevation: 10,
  },
  content: { padding: 12, backgroundColor: '#FFEFF1' },
  newsTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#E07C8E',
    marginBottom: 8,
  },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryBadge: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#F4B4C0',
  },
  categoryText: {
    fontSize: 12,
    color: '#E07C8E',
    fontFamily: 'Poppins-SemiBold',
  },

  emptyScan: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  emptyImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  emptyTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#DE576F',
  },
  emptyDesc: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#777',
    marginVertical: 5,
  },
  scanButton: {
    backgroundColor: '#DE576F',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  scanButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  emptyBox: {
    backgroundColor: '#FCE6E9',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#DE576F',
    marginBottom: 3,
  },
  emptyDescExpiry: {
    maxWidth: '90%',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#777',
    marginVertical: 5,
  },
  emptyImageExpiry: {
    width: 65,
    height: 65,
    marginLeft: 10,
  },
});

export default HomeScreen;
