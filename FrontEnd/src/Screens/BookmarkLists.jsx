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

const BookmarkLists = ({ route, navigation }) => {
  const [active, setActive] = useState('News');
  const [bookmarked, setBookmarked] = useState({});
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await api.get('/news/bookmarks');
        setNewsList(res.data);

        const bmMap = {};
        res.data.forEach(n => {
          bmMap[n.id] = true;
        });
        setBookmarked(bmMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const toggleBookmark = async newsId => {
    try {
      if (bookmarked[newsId]) {
        await api.delete(`/news/${newsId}/bookmark`);
        setBookmarked(prev => ({ ...prev, [newsId]: false }));

        setNewsList(prev => prev.filter(n => n.id !== newsId));
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
          <Text style={styles.titlePage}>My Bookmarks</Text>

          {newsList.length === 0 ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#aaa', fontSize: 16, fontFamily: 'Poppins-Regular' }}>
                No bookmarks on list
              </Text>
            </View>
          ) : (
            newsList.map(news => (
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
                      name={bookmarked[news.id] ? 'bookmark' : 'bookmark-o'}
                      size={20}
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
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF7F2' },
  newsContainer: { padding: 25 },
  titlePage: { marginBottom: 20, fontSize: 18, fontFamily: 'Poppins-Bold', color: '#E07C8E' },
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
  title: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#E07C8E', marginTop: 0, marginBottom: 8 },
  categoryContainer: { flexDirection: 'row', gap: 8 },
  categoryBadge: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#F4B4C0',
  },
  categoryText: { fontSize: 12, color: '#E07C8E', fontFamily: 'Poppins-SemiBold' },
});

export default BookmarkLists;
