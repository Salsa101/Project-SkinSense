import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import { launchImageLibrary } from 'react-native-image-picker';

import Icon2 from 'react-native-vector-icons/Ionicons';

import api from '../api';

const EditJournal = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState(null);
  const [image, setImage] = useState(null);

  const { date } = route.params || {};
  const [journalDate, setJournalDate] = useState(
    date || new Date().toISOString().split('T')[0],
  );

  const moodMap = ['cry', 'sad', 'neutral', 'happy', 'excited'];

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setImage(response.assets[0].uri);
        }
      },
    );
  };

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const { id } = route.params;
        const res = await api.get(`/journal/view/${id}`);
        const j = res.data;

        setTitle(j.title);
        setEntry(j.description);
        setMood(moodMap.indexOf(j.mood));
        setImage(
          j.journal_image ? `${api.defaults.baseURL}${j.journal_image}` : null,
        );
        setJournalDate(j.journal_date);
      } catch (err) {
        console.error('Error fetching journal detail:', err);
      }
    };

    if (route.params?.id) fetchJournal();
  }, [route.params]);

  const handleSave = async () => {
    if (!title || !entry) {
      alert('Please fill in title and entry!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', entry);
    formData.append('mood', moodMap[mood]);
    formData.append('journal_date', journalDate);

    if (image && !image.startsWith('http')) {
      const uriParts = image.split('/');
      const fileName = uriParts[uriParts.length - 1];
      const fileType = fileName.split('.').pop();

      formData.append('journal_image', {
        uri: image,
        name: fileName,
        type: `image/${fileType}`,
      });
    }

    try {
      const { id } = route.params;
      const response = await api.put(`/journal/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer YOUR_TOKEN_IF_NEEDED',
        },
      });

      if (response.status === 200) {
        alert('Journal updated successfully!');
        navigation.navigate('JournalDetail', { id });
      } else {
        alert('Failed to update journal: ' + response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating journal: ' + err.message);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this journal?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const { id } = route.params; // ambil id dari params
              const res = await api.delete(`/journal/delete/${id}`, {
                headers: {
                  Authorization: 'Bearer YOUR_TOKEN_IF_NEEDED',
                },
              });

              if (res.status === 200) {
                alert('Journal deleted successfully!');
                navigation.navigate('Calendar');
              } else {
                alert('Failed to delete journal: ' + res.data.message);
              }
            } catch (err) {
              console.error(err);
              alert('Error deleting journal: ' + err.message);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color="#E07C8E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Journal</Text>
          <TouchableOpacity style={styles.editBtn} onPress={handleDelete}>
            <Text style={[styles.editText, { color: '#E07C8E', fontFamily: 'Poppins-Semi-Bold', fontSize: 12 }]}>Delete</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Icon name="camera" size={40} color="#aaa" />
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Journal Title</Text>
        <TextInput
          style={styles.input}
          maxLength={50}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter journal title..."
        />

        <Text style={styles.label}>Journal Entry</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          maxLength={1500}
          value={entry}
          onChangeText={setEntry}
          placeholder="Write your entry..."
        />

        <Text style={styles.label}>Today's Mood</Text>
        <View style={styles.moodWrapper}>
          <TouchableOpacity
            style={[mood === 0 && styles.moodActive]}
            onPress={() => setMood(0)}
          >
            <Icon1
              name="sad-cry"
              size={28}
              color={mood === 0 ? '#fff' : '#E07C8E'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[mood === 1 && styles.moodActive]}
            onPress={() => setMood(1)}
          >
            <Icon
              name="frown-o"
              size={30}
              color={mood === 1 ? '#fff' : '#E07C8E'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[mood === 2 && styles.moodActive]}
            onPress={() => setMood(2)}
          >
            <Icon
              name="meh-o"
              size={30}
              color={mood === 2 ? '#fff' : '#E07C8E'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[mood === 3 && styles.moodActive]}
            onPress={() => setMood(3)}
          >
            <Icon
              name="smile-o"
              size={30}
              color={mood === 3 ? '#fff' : '#E07C8E'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[mood === 4 && styles.moodActive]}
            onPress={() => setMood(4)}
          >
            <Icon1
              name="smile-beam"
              size={28}
              color={mood === 4 ? '#fff' : '#E07C8E'}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>SAVE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f6',
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#E07C8E',
    marginBottom: 15,
  },
  imageBox: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  label: {
    fontSize: 14,
    color: '#B67F89',
    fontFamily: 'Poppins-Medium',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E07C8E',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  moodWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E07C8E',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 18,
  },
  moodActive: {
    backgroundColor: '#E07C8E',
    borderRadius: 80,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  saveBtn: {
    backgroundColor: '#ffb6c1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
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
    color: '#E07C8E',
    fontFamily: 'Poppins-Bold',
  },
  editBtn: { width: 40, alignItems: 'flex-end' },
  editText: { color: '#E07C8E', fontSize: 14 },
});

export default EditJournal;
