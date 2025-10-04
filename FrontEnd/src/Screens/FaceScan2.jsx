import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../api';

const BRIGHTNESS_LOW = 50;
const BRIGHTNESS_HIGH = 200;

const FaceScan2 = () => {
  const device = useCameraDevice('front');
  const [hasPermission, setHasPermission] = useState(false);
  const [faceAligned, setFaceAligned] = useState(false);
  const [facePhoto, setFacePhoto] = useState(null);
  const [brightness, setBrightness] = useState(null);
  const [scanning, setScanning] = useState(false);

  const [cameraActive, setCameraActive] = useState(true);

  const [aiResult, setAiResult] = useState(null);

  const [polling, setPolling] = useState(false);

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

  const handleBrightness = Worklets.createRunOnJS(value =>
    setBrightness(value),
  );

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

  const takeFacePhoto = async () => {
    if (!cameraRef.current || !faceBoundsRef.current) return;
    try {
      setScanning(true);

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

      setCameraActive(false);

      const scanId = response.data?.scan?.id;

      let tries = 0;
      let found = null;
      while (tries < 10 && !found) {
        const res = await api.get('/scans');
        if (res.data.scans.length > 0) {
          const latest = res.data.scans[0];
          if (!scanId || latest.id === scanId) {
            found = latest;
            setAiResult(latest);
          }
        }
        if (!found) {
          await new Promise(r => setTimeout(r, 1500));
          tries++;
        }
      }

      setScanning(false);
    } catch (e) {
      console.log('Error taking or uploading photo:', e);
      setScanning(false);
    }
  };

  const fetchScans = async () => {
    try {
      const res = await api.get(`/scans`);
      if (res.data.scans.length > 0) {
        const latest = res.data.scans[0];
        found = latest;
        setAiResult(latest);
      }
    } catch (err) {
      console.log('Fetch scans error:', err);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  useEffect(() => {
    console.log('aiResult updated:', aiResult);
  }, [aiResult]);

  if (!device || !hasPermission)
    return (
      <View style={styles.centered}>
        <Text>Loading camera...</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      {aiResult ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black',
          }}
        >
          <Image
            source={{ uri: `${api.defaults.baseURL}${aiResult.imagePath}` }}
            style={{ width: 200, height: 200 }}
            onError={e => console.log('❌ Image load error:', e.nativeEvent)}
            onLoad={() => console.log('✅ Image loaded successfully')}
          />

          <Text style={{ color: 'white', marginTop: 10 }}>
            Jumlah jerawat: {aiResult.acneCount}
          </Text>
          <Text style={{ color: 'white' }}>
            Tingkat keparahan: {aiResult.severity}
          </Text>

          <TouchableOpacity
            onPress={() => {
              setAiResult(null);
              setCameraActive(true);
            }}
            style={{
              marginTop: 20,
              padding: 10,
              backgroundColor: '#ff6680',
              borderRadius: 8,
            }}
          >
            <Text style={{ color: 'white' }}>Scan Ulang</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {!aiResult && cameraActive && (
            <Camera
              key={cameraActive ? 'camera-on' : 'camera-off'} // 👈 tambahin key
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={cameraActive}
              frameProcessor={frameProcessor}
              frameProcessorFps={5}
              photo
            />
          )}

          <View style={styles.overlay}>
            <View
              style={[
                styles.faceCircle,
                { borderColor: faceAligned ? 'green' : '#ff6680' },
              ]}
            />
          </View>

          {!scanning && (
            <>
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
                    !(
                      brightness >= BRIGHTNESS_LOW &&
                      brightness <= BRIGHTNESS_HIGH
                    )
                  }
                  onPress={takeFacePhoto}
                >
                  <Icon name="camera" size={30} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={{ position: 'absolute', top: 50, width: '100%' }}>
                <Text
                  style={{ color: 'white', textAlign: 'center', fontSize: 16 }}
                >
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
            </>
          )}

          {scanning && (
            <View style={styles.scanningOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.scanningText}>Scanning the face...</Text>
            </View>
          )}
        </>
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
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: { color: '#fff', marginTop: 15, fontSize: 18 },
});

export default FaceScan2;
