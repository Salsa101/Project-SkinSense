module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        android: null, // 🚫 jangan autolink ke Android JNI/CMake
      },
    },
  },
  assets: [
    './assets/fonts', // ✅ font custom lokal kamu
    './node_modules/react-native-vector-icons/Fonts', // ✅ font bawaan vector-icons
  ],
};