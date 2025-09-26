import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import { launchImageLibrary } from 'react-native-image-picker';

const AddJournal = () => {
  const [title, setTitle] = useState('');
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState(null);
  const [image, setImage] = useState(null);

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

  const handleSave = () => {
    console.log({
      title,
      entry,
      mood,
      image,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={styles.header}>New Journal</Text>

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
              size={30}
              color={mood === 0 ? '#fff' : '#ff69b4'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[mood === 1 && styles.moodActive]}
            onPress={() => setMood(1)}
          >
            <Icon
              name="frown-o"
              size={30}
              color={mood === 1 ? '#fff' : '#ff69b4'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[mood === 2 && styles.moodActive]}
            onPress={() => setMood(2)}
          >
            <Icon
              name="meh-o"
              size={30}
              color={mood === 2 ? '#fff' : '#ff69b4'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[mood === 3 && styles.moodActive]}
            onPress={() => setMood(3)}
          >
            <Icon
              name="smile-o"
              size={30}
              color={mood === 3 ? '#fff' : '#ff69b4'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[mood === 4 && styles.moodActive]}
            onPress={() => setMood(4)}
          >
            <Icon1
              name="smile-beam"
              size={30}
              color={mood === 4 ? '#fff' : '#ff69b4'}
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
    fontWeight: 'bold',
    color: '#ff69b4',
    marginBottom: 15,
  },
  imageBox: {
    width: '100%',
    height: 150,
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
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ff69b4',
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
    borderColor: '#ff69b4',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 18,
  },
  moodActive: {
    backgroundColor: '#ff69b4',
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
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddJournal;
