import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '../Components/Navbar';
import api from '../api';

const CategoryNews = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const [active, setActive] = useState('News');
  const [bookmarked, setBookmarked] = useState({});
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsByCategory = async () => {
      try {
        const res = await api.get(`/news/category/${categoryId}`, {
          params: { categoryId },
        });
        setNewsList(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsByCategory();
  }, [categoryId]);

  useEffect(() => {
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
  }, []);

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E07C8E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{ marginBottom: 75 }}>
        <View style={styles.newsContainer}>
          <Text style={styles.titlePage}>{categoryName}</Text>

          {newsList.map(news => (
            <View key={news.id} style={styles.card}>
              <View style={styles.imageContainer}>
                <Image
                  source={
                    news.newsImage
                      ? { uri: `${api.defaults.baseURL}/${news.newsImage}` }
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
                    size={20}
                    color="#E07C8E"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <Text style={styles.title}>{news.title}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

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
    elevation: 3,
  },
  content: { padding: 12, backgroundColor: '#FFEFF1' },
  title: { fontSize: 14, fontWeight: '600', color: '#E07C8E' },
});

export default CategoryNews;
