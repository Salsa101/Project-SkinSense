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

import { ImageEditor } from 'react-native';

const FaceScan2 = () => {
  const device = useCameraDevice('front');
  const [hasPermission, setHasPermission] = useState(false);
  const [faceAligned, setFaceAligned] = useState(false);
  const [facePhoto, setFacePhoto] = useState(null);
  const cameraRef = useRef(null);
  const faceBoundsRef = useRef(null); // Simpan bounding box face terakhir

  const faceDetectionOptions = useRef({
    landmarkMode: 'all',
    classificationMode: 'all',
    performanceMode: 'fast',
  }).current;

  const { detectFaces, stopListeners } = useFaceDetector(faceDetectionOptions);

  useEffect(() => {
    return () => stopListeners();
  }, []);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized' || status === 'granted');
    })();
  }, []);

  const handleDetectedFaces = Worklets.createRunOnJS((faces, frameSize) => {
    if (faces.length > 0) {
      const face = faces[0];
      faceBoundsRef.current = face.bounds; // Simpan bounding box
      const { bounds } = face;

      const centerX = frameSize.width / 2;
      const centerY = frameSize.height / 2;
      const faceCenterX = bounds.x + bounds.width / 2;
      const faceCenterY = bounds.y + bounds.height / 2;

      const aligned =
        Math.abs(faceCenterX - centerX) < 80 &&
        Math.abs(faceCenterY - centerY) < 120;

      setFaceAligned(aligned);
    } else {
      faceBoundsRef.current = null;
      setFaceAligned(false);
    }
  });

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      const faces = detectFaces(frame);
      handleDetectedFaces(faces, { width: frame.width, height: frame.height });
    },
    [detectFaces],
  );

  const takeFacePhoto = async () => {
    if (!cameraRef.current || !faceBoundsRef.current) return;

    try {
      const photo = await cameraRef.current.takePhoto({
        skipMetadata: true, // optional
      });

      // Bisa crop nanti di JS ke faceBoundsRef.current jika mau
      setFacePhoto(photo.path);
      console.log('Face captured:', photo.path);
    } catch (e) {
      console.log('Error taking photo:', e);
    }
  };

  if (!device || !hasPermission) {
    return (
      <View style={styles.centered}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
        photo={true} // harus diaktifkan supaya bisa takePhoto
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
            { backgroundColor: faceAligned ? '#ff6680' : '#ccc' },
          ]}
          disabled={!faceAligned}
          onPress={takeFacePhoto}
        >
          <Icon name="camera" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {facePhoto && (
        <Image
          source={{ uri: 'file://' + facePhoto }}
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
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  cameraBtn: {
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FaceScan2;
