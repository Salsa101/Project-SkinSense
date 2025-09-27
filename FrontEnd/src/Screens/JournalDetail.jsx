// JournalDetail.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import Icon4 from 'react-native-vector-icons/FontAwesome5';
import api from '../api';

import ImageViewer from 'react-native-image-zoom-viewer';

const JournalDetail = ({ route, navigation }) => {
  const { id } = route.params;
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);

  const [visible, setVisible] = useState(false);

  const moodIcons = {
    cry: { lib: 'fa5', name: 'sad-cry' },
    sad: { lib: 'fa', name: 'frown-o' },
    neutral: { lib: 'fa', name: 'meh-o' },
    happy: { lib: 'fa', name: 'smile-o' },
    excited: { lib: 'fa5', name: 'smile-beam' },
  };

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const res = await api.get(`/journal/view/${id}`);
        setJournal(res.data);
      } catch (err) {
        console.error('Error fetching journal:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJournal();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F91" />
      </View>
    );
  }

  if (!journal) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Journal not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate('Calendar')}
          >
            <Icon name="arrow-left" size={20} color="#FF6F91" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Journal</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              navigation.navigate('EditJournal', { id: journal.id })
            }
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            {/* Top row */}
            <View style={styles.metaRow}>
              <View style={styles.iconBox}>
                <Icon2 name="menu-book" size={18} color="#fff" />
              </View>
              <View style={styles.metaText}>
                <Text style={styles.dateText}>
                  {new Date(journal.journal_date).toDateString()}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 2,
                  }}
                >
                  {(() => {
                    const moodKey = journal.mood?.toLowerCase();
                    const moodData = moodIcons[moodKey];

                    if (!moodData) return null;

                    if (moodData.lib === 'fa') {
                      return (
                        <Icon3
                          name={moodData.name}
                          size={16}
                          color="#ff69b4"
                          style={{ marginRight: 6 }}
                        />
                      );
                    }
                    return (
                      <Icon4
                        name={moodData.name}
                        size={16}
                        color="#ff69b4"
                        style={{ marginRight: 6 }}
                      />
                    );
                  })()}

                  <Text style={styles.moodText}>
                    {journal.mood.charAt(0).toUpperCase() +
                      journal.mood.slice(1)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Title */}
            <Text style={styles.title}>{journal.title}</Text>

            {/* Image */}
            <TouchableOpacity onPress={() => setVisible(true)}>
              <Image
                source={
                  journal?.journal_image && journal.journal_image.trim() !== ''
                    ? { uri: `${api.defaults.baseURL}${journal.journal_image}` }
                    : require('../../assets/journal-detail.jpg')
                }
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>

            <Modal visible={visible} transparent={true}>
              <ImageViewer
                imageUrls={[
                  journal?.journal_image && journal.journal_image.trim() !== ''
                    ? { url: `${api.defaults.baseURL}${journal.journal_image}` }
                    : {
                        props: {
                          source: require('../../assets/journal-detail.jpg'),
                        },
                      },
                ]}
                enableSwipeDown
                onSwipeDown={() => setVisible(false)}
                onClick={() => setVisible(false)}
              />
            </Modal>

            {/* Body */}
            <Text style={styles.bodyText}>{journal.description}</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default JournalDetail;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2EFED' },
  container: { flex: 1, paddingHorizontal: 16 },
  headerRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  backBtn: { width: 40, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: '#FF6F91',
    fontWeight: '600',
  },
  editBtn: { width: 40, alignItems: 'flex-end' },
  editText: { color: '#FF6F91', fontSize: 14 },
  scrollContent: { paddingBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#FF9FB3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaText: { marginLeft: 10 },
  dateText: { color: '#666', fontSize: 12 },
  moodText: { color: '#FF9FB3', fontSize: 12, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0E3E6', marginVertical: 12 },
  title: {
    fontSize: 18,
    color: '#E84D6A',
    fontWeight: '700',
    marginBottom: 12,
  },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 12 },
  bodyText: { color: '#D54A61', fontSize: 14, lineHeight: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
