import { React, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';

import Navbar from '../Components/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome';

const News = ({ navigation }) => {
  const [active, setActive] = useState('News');
  const [bookmarked, setBookmarked] = useState(false);

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
              />
            </View>

            <TouchableOpacity style={styles.bookmarkButton}>
              <Icon name="star" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.newsContainerTitle}>From SkinSense</Text>
            {/* Card News - Skinsense */}
            <View style={styles.card}>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
                  }}
                  style={styles.image}
                />
                <TouchableOpacity
                  style={styles.bookmarkBtn}
                  onPress={() => setBookmarked(!bookmarked)}
                >
                  <Icon
                    name={bookmarked ? 'star' : 'star-o'}
                    size={20}
                    color="#E07C8E"
                  />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.title}>
                  Skincare 101: What You Need To Know
                </Text>

                <View style={styles.categoryContainer}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>Tips & Tricks</Text>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>News</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
                  }}
                  style={styles.image}
                />
                <TouchableOpacity
                  style={styles.bookmarkBtn}
                  onPress={() => setBookmarked(!bookmarked)}
                >
                  <Icon
                    name={bookmarked ? 'star' : 'star-o'}
                    size={20}
                    color="#E07C8E"
                  />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.title}>
                  Skincare 101: What You Need To Know
                </Text>

                <View style={styles.categoryContainer}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>Tips & Tricks</Text>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>News</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Card News - Others */}
            <View>
              <View style={{ marginTop: 15 }}>
                <Text style={styles.newsContainerTitle}>Others</Text>
              </View>

              {/* Category News */}
              <View style={{ marginBottom: 10 }}>
                <View style={styles.categoryContainer}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>Tips & Tricks</Text>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>News</Text>
                  </View>
                </View>
              </View>

              {/* Card News - Skinsense */}
              <View style={styles.card}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
                    }}
                    style={styles.image}
                  />
                  <TouchableOpacity
                    style={styles.bookmarkBtn}
                    onPress={() => setBookmarked(!bookmarked)}
                  >
                    <Icon
                      name={bookmarked ? 'star' : 'star-o'}
                      size={20}
                      color="#E07C8E"
                    />
                  </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                  <Text style={styles.title}>
                    Skincare 101: What You Need To Know
                  </Text>

                  <View style={styles.categoryContainer}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>Tips & Tricks</Text>
                    </View>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>News</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
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
  container: {
    flex: 1,
  },
  newsContainer: {
    padding: 25,
  },
  titlePage: {
    marginBottom: 20,
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
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#E07C8E',
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E07C8E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsContainerTitle: {
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    elevation: 3,
  },
  content: {
    padding: 12,
    backgroundColor: '#FFEFF1',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E07C8E',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
  },
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
    fontWeight: '500',
  },
});

export default News;
