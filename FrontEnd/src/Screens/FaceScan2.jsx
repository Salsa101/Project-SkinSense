import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../api'; // pastikan sudah import instance axios

const BRIGHTNESS_LOW = 50;
const BRIGHTNESS_HIGH = 200;

const FaceScan2 = () => {
  const device = useCameraDevice('front');
  const [hasPermission, setHasPermission] = useState(false);
  const [faceAligned, setFaceAligned] = useState(false);
  const [facePhoto, setFacePhoto] = useState(null); // URI preview backend
  const [brightness, setBrightness] = useState(null);

  const cameraRef = useRef(null);
  const faceBoundsRef = useRef(null);

  const { detectFaces, stopListeners } = useFaceDetector({
    landmarkMode: 'all',
    classificationMode: 'all',
    performanceMode: 'fast',
  });

  useEffect(() => () => stopListeners(), []);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized' || status === 'granted');
    })();
  }, []);

  // --- Face detection ---
  const handleDetectedFaces = Worklets.createRunOnJS((faces, frameSize) => {
    if (faces.length > 0) {
      const face = faces[0];
      faceBoundsRef.current = face.bounds;

      const centerX = frameSize.width / 2;
      const centerY = frameSize.height / 2;
      const faceCenterX = face.bounds.x + face.bounds.width / 2;
      const faceCenterY = face.bounds.y + face.bounds.height / 2;

      setFaceAligned(
        Math.abs(faceCenterX - centerX) < 80 &&
          Math.abs(faceCenterY - centerY) < 120,
      );
    } else {
      faceBoundsRef.current = null;
      setFaceAligned(false);
    }
  });

  // --- Brightness ---
  const handleBrightness = Worklets.createRunOnJS(value =>
    setBrightness(value),
  );

  // --- Frame processor ---
  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      const faces = detectFaces(frame);
      handleDetectedFaces(faces, { width: frame.width, height: frame.height });

      try {
        const buffer = frame.toArrayBuffer();
        const data = new Uint8Array(buffer);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        handleBrightness(sum / data.length);
      } catch {
        handleBrightness(0);
      }
    },
    [detectFaces],
  );

  // --- Ambil foto & upload ke backend ---
  const takeFacePhoto = async () => {
    if (!cameraRef.current || !faceBoundsRef.current) return;
    try {
      const photo = await cameraRef.current.takePhoto({ skipMetadata: true });

      const formData = new FormData();
      formData.append('facePhoto', {
        uri: 'file://' + photo.path,
        type: 'image/jpeg',
        name: 'face.jpg',
      });

      const response = await api.post('/upload-face', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Upload response:', response.data);
      // Preview dari backend
      setFacePhoto(`${api.defaults.baseURL}/${response.data.filePath}`);
    } catch (e) {
      console.log('Error taking or uploading photo:', e);
    }
  };

  if (!device || !hasPermission)
    return (
      <View style={styles.centered}>
        <Text>Loading camera...</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
        photo
      />

      <View style={styles.overlay}>
        <View
          style={[
            styles.faceCircle,
            { borderColor: faceAligned ? 'green' : '#ff6680' },
          ]}
        />
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.cameraBtn,
            {
              backgroundColor:
                faceAligned &&
                brightness >= BRIGHTNESS_LOW &&
                brightness <= BRIGHTNESS_HIGH
                  ? '#ff6680'
                  : '#ccc',
            },
          ]}
          disabled={
            !faceAligned ||
            !(brightness >= BRIGHTNESS_LOW && brightness <= BRIGHTNESS_HIGH)
          }
          onPress={takeFacePhoto}
        >
          <Icon name="camera" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={{ position: 'absolute', top: 50, width: '100%' }}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
          Brightness: {brightness ? brightness.toFixed(0) : '...'}
        </Text>
        {brightness < BRIGHTNESS_LOW && (
          <Text style={{ color: 'red', textAlign: 'center' }}>
            Terlalu gelap
          </Text>
        )}
        {brightness > BRIGHTNESS_HIGH && (
          <Text style={{ color: 'yellow', textAlign: 'center' }}>
            Terlalu terang
          </Text>
        )}
      </View>

      {facePhoto && (
        <Image
          source={{ uri: facePhoto }}
          style={{
            width: 150,
            height: 200,
            alignSelf: 'center',
            marginTop: 20,
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  faceCircle: {
    width: 250,
    height: 360,
    borderRadius: 400,
    borderWidth: 4,
    borderStyle: 'dashed',
  },
  bottomBar: { position: 'absolute', bottom: 40, alignSelf: 'center' },
  cameraBtn: {
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FaceScan2;
