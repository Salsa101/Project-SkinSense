import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '../Components/Navbar';
import api from '../api';

import { useCustomBackHandler } from '../Handler/CustomBackHandler';

import { useFocusEffect } from '@react-navigation/native';

const News = ({ navigation }) => {
  //Handler Back to Home
  useCustomBackHandler(() => {
    navigation.navigate('Home');
  });

  const [page, setPage] = useState(1);
  const [active, setActive] = useState('News');
  const [bookmarked, setBookmarked] = useState({});
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setPage(1);
      setHasMore(true);
      await fetchNews(true); // reset news list
    } finally {
      setRefreshing(false);
    }
  };

  const fetchNews = async (reset = false) => {
    try {
      setLoading(true);
      const res = await api.get('/news', {
        params: { search, page, limit: 10 },
      });

      if (reset) {
        setNewsList(res.data);
      } else {
        setNewsList(prev => [...prev, ...res.data]);
      }

      if (res.data.length < 10) setHasMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      fetchNews(true);
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const loadMore = () => {
    if (!hasMore) return;
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    if (page > 1) fetchNews();
  }, [page]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchBookmarks = async () => {
        try {
          const res = await api.get('/news/bookmarks');
          const bmMap = {};
          res.data.forEach(n => {
            bmMap[n.id] = true;
          });
          setBookmarked(bmMap);
        } catch (err) {
          console.error(err);
        }
      };

      fetchBookmarks();
    }, []),
  );

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

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories', {
        params: { isActive: true },
      });
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E07C8E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ marginBottom: 75 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#E07C8E']}
          />
        }
      >
        <View style={styles.newsContainer}>
          <Text style={styles.titlePage}>Skincare Tips</Text>
          <View style={styles.searchContainer}>
            <View style={styles.inputContainer}>
              <Icon
                name="search"
                size={18}
                color="#E07C8E"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Search by title..."
                placeholderTextColor="#aaa"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={() => navigation.navigate('BookmarkLists')}
            >
              <Icon name="bookmark" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Banner Section */}
          <TouchableOpacity
            style={styles.bannerContainer}
            onPress={() => navigation.navigate('StepRoutine')}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/step-routine.jpg')}
              style={styles.bannerImage}
            />
            <View style={styles.bannerOverlay} />

            {/* Image wajah kiri atas */}
            <View style={styles.bannerTopLeft}>
              <Image
                source={require('../../assets/woman.png')} // ganti sesuai file image kamu
                style={styles.bannerUserImage}
              />
            </View>

            {/* Teks bawah */}
            <View style={styles.bannerTextWrapper}>
              <Text style={styles.bannerText}>Check Your Routine</Text>
              <Text style={styles.bannerDesc}>
                Learn more about how to do{'\n'}skincare properly
              </Text>
            </View>

            {/* Icon panah kanan bawah dalam bulatan */}
            <View style={styles.bannerBottomRight}>
              <View style={styles.circleIcon}>
                <Icon name="arrow-right" size={16} color="#ffffffff" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Category News */}
          <View style={{ marginBottom: 10, marginHorizontal: -25 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryContainerScroll}
            >
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryBadge,
                    index === 0 && { marginLeft: 25 },
                    index === categories.length - 1 && { marginRight: 25 },
                  ]}
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
            </ScrollView>
          </View>

          {newsList.length > 0 ? (
            newsList.map(news => (
              <TouchableOpacity
                key={news.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('NewsDetail', { id: news.id })
                }
                activeOpacity={0.8}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={
                      news.newsImage
                        ? { uri: `${api.defaults.baseURL}${news.newsImage}` }
                        : require('../../assets/category-admin.jpg')
                    }
                    style={styles.image}
                  />
                  <TouchableOpacity
                    style={styles.bookmarkBtn}
                    onPress={() => toggleBookmark(news.id)}
                  >
                    <Icon
                      name={bookmarked[news.id] ? 'bookmark' : 'bookmark-o'}
                      size={24}
                      color="#E07C8E"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.content}>
                  <Text style={styles.title}>{news.title}</Text>
                  <View style={styles.categoryContainer}>
                    {news.Categories?.map(category => (
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
            ))
          ) : (
            <Text
              style={{
                textAlign: 'center',
                marginTop: 20,
                color: '#B67F89',
                fontFamily: 'Poppins-Medium',
                fontSize: 12,
              }}
            >
              No news on the list
            </Text>
          )}

          {hasMore && !loading && (
            <TouchableOpacity
              style={[
                styles.loadMoreBtn,
                {
                  alignSelf: 'center',
                  backgroundColor: '#E07C8E',
                  paddingHorizontal: 20,
                  paddingVertical: 8,
                  borderRadius: 25,
                  marginVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}
              onPress={loadMore}
            >
              <Icon
                name="angle-down"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.loadMoreText,
                  { color: '#fff', fontWeight: '600', textAlign: 'center' },
                ]}
              >
                Load More
              </Text>
            </TouchableOpacity>
          )}

          {loading && <ActivityIndicator size="small" color="#E07C8E" />}
        </View>
      </ScrollView>

      {/* Navbar */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <Navbar active={active} onPress={setActive} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F3' },
  newsContainer: { padding: 25 },
  titlePage: {
    marginBottom: 20,
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#E07C8E',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
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
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#E07C8E',
    marginBottom: 8,
  },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryContainerScroll: { flexDirection: 'row', gap: 8 },
  categoryBadge: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#F4B4C0',
  },
  categoryText: { fontSize: 12, color: '#E07C8E', fontFamily: 'Poppins-SemiBold' },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E07C8E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E07C8E',
    borderRadius: 25,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    height: 40,
    marginRight: 10,
  },
  newsContainerTitle: {
    marginBottom: 10,
    marginTop: 10,
  },
  bannerContainer: {
    position: 'relative',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 5,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bannerText: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  bannerTextWrapper: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
  },
  bannerText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  bannerDesc: {
    color: '#f5f5f5',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  bannerTopLeft: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  bannerBottomRight: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },

  circleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bannerUserImage: {
    width: 26,
    height: 26,
  },
});

export default News;
