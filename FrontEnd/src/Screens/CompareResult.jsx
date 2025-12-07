import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import api from '../api';
import ImageViewer from 'react-native-image-zoom-viewer';

const { width } = Dimensions.get('window');

const CompareResult = ({ route, navigation }) => {
  const { compareData, firstScanId, secondScanId } = route.params || {};
  const [data, setData] = useState(compareData || null);
  const [loading, setLoading] = useState(!compareData);

  const [zoomVisible, setZoomVisible] = useState(false);

  useEffect(() => {
    if (!compareData && firstScanId && secondScanId) {
      fetchCompare();
    }
  }, []);

  const fetchCompare = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/compare-scan/${firstScanId}/${secondScanId}`);
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error('Error fetching compare result:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = dateString => {
    const [year, month, day] = dateString.split('-');
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
    return `${parseInt(day)} ${monthNames[parseInt(month) - 1]} ${year}`;
  };

  if (loading || !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff8fb1" />
      </View>
    );
  }

  const { before, after, difference } = data;

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* Header */}
        <Text style={styles.title}>Compare Result</Text>

        {/* Date */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {formatDate(before.date)}, {before.time}
          </Text>
          <Text style={styles.dateText}>
            {formatDate(after.date)}, {after.time}
          </Text>
        </View>

        {/* Before & After Images */}
        <View style={styles.imageWrapper}>
          <View style={styles.imageRow}>
            <View style={styles.imageBoxBorder}>
              {/* Before Image */}
              <TouchableOpacity onPress={() => setZoomVisible(true)}>
                <Image
                  source={{ uri: before.imagePath }}
                  style={[styles.image, styles.leftImage]}
                />
              </TouchableOpacity>

              <View style={styles.middleDivider} />

              {/* After Image */}
              <TouchableOpacity onPress={() => setZoomVisible(true)}>
                <Image
                  source={{ uri: after.imagePath }}
                  style={[styles.image, styles.rightImage]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Labels */}
          <Text style={[styles.imageLabel, styles.beforeLabel]}>Before</Text>
          <Text style={[styles.imageLabel, styles.afterLabel]}>After</Text>
        </View>

        {/* Modal Zoom */}
        <Modal visible={zoomVisible} transparent={true}>
          <ImageViewer
            imageUrls={[{ url: before.imagePath }, { url: after.imagePath }]}
            enableSwipeDown
            onSwipeDown={() => setZoomVisible(false)}
            index={0} // mulai dari gambar Before
          />
        </Modal>

        {/* Score */}
        <View style={styles.card}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={styles.cardTitle}>Score:</Text>

            {after.rating && (
              <View
                style={{
                  backgroundColor:
                    after.rating === 'Poor'
                      ? '#FDE2E4'
                      : after.rating === 'Fair'
                      ? '#FFF4E0'
                      : after.rating === 'Good'
                      ? '#E0FDE0'
                      : '#D6E4FF',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    color:
                      after.rating === 'Poor'
                        ? '#E07C8E'
                        : after.rating === 'Fair'
                        ? '#FFA500'
                        : after.rating === 'Good'
                        ? '#32CD32'
                        : '#1E40AF',
                    fontWeight: 'bold',
                    fontSize: 12,
                  }}
                >
                  {after.rating}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.scoreRow}>
            <Text style={styles.scoreText}>Before</Text>
            <Text style={styles.scoreValue}>{before.score}%</Text>
          </View>
          <View style={styles.barContainer}>
            <View style={[styles.bar, { width: `${before.score}%` }]} />
          </View>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreText}>After</Text>
            <Text style={styles.scoreValue}>{after.score}%</Text>
          </View>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                { width: `${after.score}%`, backgroundColor: '#ff8fb1' },
              ]}
            />
          </View>
          <View>
            {/* Score change note */}
            {difference.scoreChangeNote && (
              <Text
                style={[
                  styles.subText,
                  { marginBottom: 4, fontStyle: 'italic' },
                ]}
              >
                {difference.scoreChangeNote}
              </Text>
            )}
          </View>
        </View>

        {/* Skin Type */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Skin Type</Text>

          <View style={styles.divider} />

          <View style={styles.arrowRow}>
            <Text style={styles.badge}>{before.skinType} Skin</Text>
            <Icon name="arrow-forward" size={20} color="#ff8fb1" />
            <Text style={styles.badge}>{after.skinType} Skin</Text>
          </View>
        </View>

        {/* Acnes Spotted */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Acnes Spotted</Text>

          <View style={styles.divider} />

          <View style={styles.arrowRow}>
            <Text style={styles.badge}>{before.acneCount} Acnes</Text>
            <Icon name="arrow-forward" size={20} color="#ff8fb1" />
            <Text style={styles.badge}>{after.acneCount} Acnes</Text>
          </View>
          <Text style={styles.subText}>
            Acne Change: {difference.acneChange}
          </Text>
        </View>

        {/* Severity */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Severity</Text>

          <View style={styles.divider} />

          <View style={styles.arrowRow}>
            <Text style={styles.badge}>{before.severity}</Text>
            <Icon name="arrow-forward" size={20} color="#ff8fb1" />
            <Text style={styles.badge}>{after.severity}</Text>
          </View>
          <Text style={styles.subText}>{difference.severityChange}</Text>
        </View>

        {/* Done Button */}
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.navigate('CompareScan')}
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff6f6',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#d94f7d',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#b57d7d',
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 25,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative', // <— penting biar label absolute ke sini
  },
  imageBoxBorder: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#e67186',
    borderRadius: 12,
    overflow: 'hidden',
    width: width - 40,
    height: 180,
    backgroundColor: '#fff',
  },
  image: {
    width: (width - 40) / 2,
    height: 180,
    resizeMode: 'cover',
  },

  middleDivider: {
    width: 1.5,
    backgroundColor: '#e67186',
    height: '100%',
  },
  leftImage: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: 1,
    borderRightColor: '#e67186',
  },
  rightImage: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#e67186',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 270,
    marginTop: 8,
  },
  imageLabel: {
    position: 'absolute',
    bottom: -12,
    backgroundColor: '#e67186',
    color: '#fff',
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 20,
    fontSize: 13,
  },
  beforeLabel: {
    left: width / 4 - 50,
  },
  afterLabel: {
    right: width / 4 - 50,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreText: {
    fontSize: 13,
    color: '#666',
  },
  scoreValue: {
    fontWeight: '600',
    color: '#d94f7d',
  },
  barContainer: {
    height: 8,
    backgroundColor: '#ffe1e8',
    borderRadius: 5,
    marginVertical: 5,
  },
  bar: {
    height: '100%',
    backgroundColor: '#f5a3b8',
    borderRadius: 5,
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: '#ffe1e8',
    color: '#d94f7d',
    fontWeight: '600',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  subText: {
    marginTop: 8,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#e67186',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 15,
    marginBottom: 20,
  },
  doneText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e67186',
    marginBottom: 15,
    marginHorizontal: -15,
  },
});

export default CompareResult;
