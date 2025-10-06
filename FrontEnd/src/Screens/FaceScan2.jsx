import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../api';

import { useCustomBackHandler } from '../Handler/CustomBackHandler';

import ImageViewer from 'react-native-image-zoom-viewer';

const SCREEN_WIDTH = Dimensions.get('window').width;

const BRIGHTNESS_LOW = 50;
const BRIGHTNESS_HIGH = 200;

const FaceScan2 = ({ navigation }) => {
  //Handler Back to Home
  useCustomBackHandler(() => {
    navigation.navigate('Home');
  });

  const device = useCameraDevice('front');
  const [hasPermission, setHasPermission] = useState(false);
  const [faceAligned, setFaceAligned] = useState(false);
  const [brightness, setBrightness] = useState(null);
  const [scanning, setScanning] = useState(false);

  const [visible, setVisible] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
      setAiResult(null);
      setCameraActive(true);
    }, []),
  );

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
    if (!aiResult && !cameraActive) {
      fetchScans();
    }
  }, [aiResult, cameraActive]);

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
        <ScrollView style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                color: '#E07C8E',
              }}
            >
              Scan Result
            </Text>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#E07C8E',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 8,
              }}
              onPress={() => {
                setAiResult(null);
                setCameraActive(true);
              }}
            >
              <Icon name="refresh" size={20} color="#fff" />
              <Text
                style={{ color: 'white', fontWeight: '600', marginLeft: 6 }}
              >
                Rescan
              </Text>
            </TouchableOpacity>
          </View>

          {/* Image */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            {/* Modal Zoom */}
            <Modal visible={visible} transparent={true}>
              <ImageViewer
                imageUrls={[
                  { url: `${api.defaults.baseURL}${aiResult.imagePath}` },
                ]}
                enableSwipeDown
                onSwipeDown={() => setVisible(false)}
              />
            </Modal>

            {/* Image Preview */}
            <TouchableOpacity onPress={() => setVisible(true)}>
              <Image
                source={{ uri: `${api.defaults.baseURL}${aiResult.imagePath}` }}
                style={{
                  width: SCREEN_WIDTH - 40,
                  height: SCREEN_WIDTH - 40,
                  borderRadius: 15,
                }}
                onError={e =>
                  console.log('❌ Image load error:', e.nativeEvent)
                }
                onLoad={() => console.log('✅ Image loaded successfully')}
              />
            </TouchableOpacity>
          </View>

          {/* Scan Info */}
          <View style={{ marginBottom: 16 }}>
            {/* Row 1 */}
            <View style={{ flexDirection: 'row', marginBottom: 8, gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', marginBottom: 4 }}>
                  Skin Type :
                </Text>
                <Text
                  style={{
                    backgroundColor: '#FDE2E4',
                    color: '#E07C8E',
                    padding: 6,
                    borderRadius: 6,
                  }}
                >
                  {aiResult.skinType}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', marginBottom: 4 }}>
                  Score :
                </Text>
                <Text
                  style={{
                    backgroundColor: '#FDE2E4',
                    color: '#E07C8E',
                    padding: 6,
                    borderRadius: 6,
                  }}
                >
                  78/100
                </Text>
              </View>
            </View>

            {/* Row 2 */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', marginBottom: 4 }}>
                  Acne Spotted :
                </Text>
                <Text
                  style={{
                    backgroundColor: '#FDE2E4',
                    color: '#E07C8E',
                    padding: 6,
                    borderRadius: 6,
                  }}
                >
                  {aiResult.acneCount} Acne Spotted
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', marginBottom: 4 }}>
                  Severity :
                </Text>
                <Text
                  style={{
                    backgroundColor: '#FDE2E4',
                    color: '#E07C8E',
                    padding: 6,
                    borderRadius: 6,
                  }}
                >
                  {aiResult.severity}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: '#E07C8E',
              width: '100%',
              marginTop: 10,
              marginBottom: 20,
            }}
          />

          {/* Timeline Sections */}
          <View style={{ marginBottom: 16, paddingLeft: 5 }}>
            {/* Ingredients For You */}
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 20, alignItems: 'center' }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#E07C8E',
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    width: 2,
                    backgroundColor: '#E07C8E',
                    marginTop: 2,
                  }}
                />
              </View>

              <View style={{ flex: 1, paddingLeft: 12, marginBottom: 16 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
                  Ingredients For You
                </Text>
                <View
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}
                >
                  <Text
                    style={{
                      backgroundColor: '#FFF0F2',
                      color: '#E07C8E',
                      padding: 6,
                      borderRadius: 6,
                    }}
                  >
                    ✔ Centella Asiatica
                  </Text>
                  <Text
                    style={{
                      backgroundColor: '#FFF0F2',
                      color: '#E07C8E',
                      padding: 6,
                      borderRadius: 6,
                    }}
                  >
                    ✔ Jojoba Oil
                  </Text>
                  <Text
                    style={{
                      backgroundColor: '#FFF0F2',
                      color: '#E07C8E',
                      padding: 6,
                      borderRadius: 6,
                    }}
                  >
                    ✔ Ceramide NP
                  </Text>
                  <Text
                    style={{
                      backgroundColor: '#FFF0F2',
                      color: '#E07C8E',
                      padding: 6,
                      borderRadius: 6,
                    }}
                  >
                    ✔ Hyaluronic Acid
                  </Text>
                </View>
              </View>
            </View>

            {/* What to Avoid */}
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 20, alignItems: 'center' }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#E07C8E',
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    width: 2,
                    backgroundColor: '#E07C8E',
                    marginTop: 2,
                  }}
                />
              </View>

              <View style={{ flex: 1, paddingLeft: 12, marginBottom: 16 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
                  What to Avoid
                </Text>
                <View
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}
                >
                  <Text
                    style={{
                      backgroundColor: '#FFEAEA',
                      color: '#E07C8E',
                      padding: 6,
                      borderRadius: 6,
                    }}
                  >
                    ✖ Alcohol
                  </Text>
                  <Text
                    style={{
                      backgroundColor: '#FFEAEA',
                      color: '#E07C8E',
                      padding: 6,
                      borderRadius: 6,
                    }}
                  >
                    ✖ Fragrance
                  </Text>
                  <Text
                    style={{
                      backgroundColor: '#FFEAEA',
                      color: '#E07C8E',
                      padding: 6,
                      borderRadius: 6,
                    }}
                  >
                    ✖ Coconut Oil
                  </Text>
                  <Text
                    style={{
                      backgroundColor: '#FFEAEA',
                      color: '#E07C8E',
                      padding: 6,
                      borderRadius: 6,
                    }}
                  >
                    ✖ AHA/BHA
                  </Text>
                </View>
              </View>
            </View>

            {/* Products For You */}
            <View style={{ flexDirection: 'row', marginBottom: 24 }}>
              <View style={{ width: 20, alignItems: 'center' }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#E07C8E',
                  }}
                />
              </View>

              <View style={{ flex: 1, paddingLeft: 12 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
                  Products For You
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      alignItems: 'center',
                      width: 80,
                      backgroundColor: '#c7c7c7ff',
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <Image
                      source={require('../../assets/banner-profile.png')}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        marginBottom: 4,
                      }}
                    />
                    <Text style={{ fontSize: 12, textAlign: 'center' }}>
                      Hydrating Serum
                    </Text>
                  </View>

                  <View
                    style={{
                      alignItems: 'center',
                      width: 80,
                      backgroundColor: '#c7c7c7ff',
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <Image
                      source={require('../../assets/banner-profile.png')}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        marginBottom: 4,
                      }}
                    />
                    <Text style={{ fontSize: 12, textAlign: 'center' }}>
                      Hydrating Serum
                    </Text>
                  </View>

                  <View
                    style={{
                      alignItems: 'center',
                      width: 80,
                      backgroundColor: '#c7c7c7ff',
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <Image
                      source={require('../../assets/banner-profile.png')}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        marginBottom: 4,
                      }}
                    />
                    <Text style={{ fontSize: 12, textAlign: 'center' }}>
                      Hydrating Serum
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Compare Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#E07C8E',
              paddingVertical: 12,
              borderRadius: 30,
              alignItems: 'center',
              marginBottom: 40,
            }}
            onPress={() => navigation.navigate('Calendar')}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Start Tracking
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
  container: { flex: 1 },
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
