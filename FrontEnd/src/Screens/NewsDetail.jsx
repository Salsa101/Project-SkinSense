import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../api';

import { Dimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';

const { width } = Dimensions.get('window');

const NewsDetail = ({ route, navigation }) => {
  const { id } = route.params; // ambil id dari navigation params
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get(`/news/${id}`);
        setNews(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#d6336c" />
      </View>
    );
  }

  if (!news) {
    return (
      <View style={styles.loader}>
        <Text>News not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* Header dengan back dan bookmark */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="star-outline" size={30} color="#E07C8E" />
        </TouchableOpacity>
      </View>

      {/* Gambar utama */}
      <Image
        source={{ uri: `http://10.0.2.2:3000/${news.newsImage}` }}
        style={styles.mainImage}
      />

      <View style={styles.contentBox}>
        {/* Judul */}
        <Text style={styles.title}>{news.title}</Text>

        {/* Tags dari kategori */}
        <View style={styles.tags}>
          {news.Categories?.map(category => (
            <TouchableOpacity
              key={category.id}
              style={styles.tag}
              onPress={() =>
                navigation.navigate('CategoryNews', {
                  categoryId: category.id,
                  categoryName: category.name,
                })
              }
            >
              <Text style={styles.tagText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Isi konten */}
        <RenderHTML
          contentWidth={width}
          source={{ html: news.content }}
          tagsStyles={{
            h1: {
              fontSize: 24,
              fontWeight: 'bold',
              color: '#d6336c',
              marginBottom: 10,
            },
            h2: {
              fontSize: 20,
              fontWeight: '600',
              color: '#333',
              marginTop: 15,
              marginBottom: 8,
            },
            p: {
              fontSize: 14,
              color: '#333',
              lineHeight: 22,
              marginBottom: 10,
            },
            a: {
              color: '#007bff',
              textDecorationLine: 'underline',
            },
            li: {
              fontSize: 14,
              color: '#444',
              marginBottom: 5,
            },
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: 220,
  },
  contentBox: {
    backgroundColor: '#dbdbdbff',
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 0,
    padding: 25,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#d6336c',
    marginBottom: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  tag: {
    backgroundColor: '#f8d7da',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 12,
    color: '#d6336c',
  },
  paragraph: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
});

export default NewsDetail;
