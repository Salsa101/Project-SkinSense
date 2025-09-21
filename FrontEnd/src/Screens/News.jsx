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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '../Components/Navbar';
import api from '../api';

import { useFocusEffect } from '@react-navigation/native';

const News = ({ navigation }) => {
  const [active, setActive] = useState('News');
  const [bookmarked, setBookmarked] = useState({});
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get('/news', {
          params: { search },
        });
        setNewsList(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [search]);

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
      <ScrollView style={{ marginBottom: 75 }}>
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
              <Icon name="star" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Category News */}
          <View style={{ marginBottom: 10 }}>
            <View style={styles.categoryContainer}>
              {categories.map(category => (
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

          {/* From SkinSense */}
          {newsList.filter(n => n.sourceType === 'skinsense').length > 0 && (
            <>
              <Text style={styles.newsContainerTitle}>From SkinSense</Text>
              {newsList
                .filter(n => n.sourceType === 'skinsense')
                .map(news => (
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
                            ? { uri: `http://10.0.2.2:3000/${news.newsImage}` }
                            : require('../../assets/category-admin.jpg')
                        }
                        style={styles.image}
                      />
                      <TouchableOpacity
                        style={styles.bookmarkBtn}
                        onPress={() => toggleBookmark(news.id)}
                      >
                        <Icon
                          name={bookmarked[news.id] ? 'star' : 'star-o'}
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
                            <Text style={styles.categoryText}>
                              {category.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </>
          )}

          {/* Others */}
          {newsList.filter(n => n.sourceType === 'others').length > 0 && (
            <>
              <Text style={styles.newsContainerTitle}>Others</Text>
              {newsList
                .filter(n => n.sourceType === 'others')
                .map(news => (
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
                            ? { uri: `http://10.0.2.2:3000/${news.newsImage}` }
                            : require('../../assets/category-admin.jpg')
                        }
                        style={styles.image}
                      />
                      <TouchableOpacity
                        style={styles.bookmarkBtn}
                        onPress={() => toggleBookmark(news.id)}
                      >
                        <Icon
                          name={bookmarked[news.id] ? 'star' : 'star-o'}
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
                            <Text style={styles.categoryText}>
                              {category.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </>
          )}

          {newsList.filter(n => n.sourceType === 'skinsense').length === 0 &&
            newsList.filter(n => n.sourceType === 'others').length === 0 && (
              <Text
                style={{ textAlign: 'center', marginTop: 20, color: '#555' }}
              >
                No news on the list
              </Text>
            )}
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
  container: { flex: 1 },
  newsContainer: { padding: 25 },
  titlePage: { marginBottom: 20, fontSize: 18, fontWeight: '600' },
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
  title: { fontSize: 14, fontWeight: '600', color: '#E07C8E', marginBottom: 8 },
  categoryContainer: { flexDirection: 'row', gap: 8 },
  categoryBadge: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#F4B4C0',
  },
  categoryText: { fontSize: 12, color: '#E07C8E', fontWeight: '500' },
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
});

export default News;
