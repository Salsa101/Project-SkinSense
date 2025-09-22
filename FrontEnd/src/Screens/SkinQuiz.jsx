import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';

import api from '../api';

const SkinQuiz = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get('/question');
        setQuestions(res.data);
      } catch (err) {
        console.log('Gagal ambil question:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const totalQuestions = questions.length;
  const progressPercent = totalQuestions
    ? ((currentQuestion + 1) / totalQuestions) * 100
    : 0;

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelected(null);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelected(null);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = Object.entries(answers).map(
        ([quizQuestionId, quizOptionId]) => ({
          quizQuestionId: Number(quizQuestionId),
          quizOptionId,
        }),
      );

      await api.post('/answer', { answers: payload });
      alert('Jawaban tersimpan!');
    } catch (err) {
      console.log('Gagal submit:', err);
    }
  };

  const optionImages = {
    1: require('../../assets/opt1.png'),
    2: require('../../assets/opt2.png'),
    3: require('../../assets/opt3.png'),
    4: require('../../assets/opt4.png'),
    5: require('../../assets/opt5.png'),
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F49CA5" />
      </View>
    );
  }

  if (!questions.length) {
    return (
      <View style={styles.center}>
        <Text>Tidak ada pertanyaan tersedia</Text>
      </View>
    );
  }

  const current = questions[currentQuestion];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Skin Quiz</Text>

        {/* Progress Bar */}
        <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>

        <Text style={styles.question}>
          Question {currentQuestion + 1} of {totalQuestions}
        </Text>
        <Text style={styles.title}>{current.quizQuestion}</Text>
        <Text style={styles.desc}>{current.description}</Text>

        {current.quizOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.option,
              answers[current.id] === option.id && styles.selectedOption,
              current.id === 1 ? styles.optionLeft : styles.optionCenter,
            ]}
            onPress={() => {
              if (option.id === 5) {
                navigation.navigate('SkinGuide');
                return;
              }

              if (answers[current.id] === option.id) {
                const updatedAnswers = { ...answers };
                delete updatedAnswers[current.id];
                setAnswers(updatedAnswers);
              } else {
                setAnswers(prev => ({
                  ...prev,
                  [current.id]: option.id,
                }));
              }
            }}
          >
            {current.id === 1 && optionImages[option.id] && (
              <Image
                source={optionImages[option.id]}
                style={styles.iconImage}
              />
            )}

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.optionTitle,
                  current.id === 1 ? styles.textLeft : styles.textCenter,
                ]}
              >
                {option.title}
              </Text>
              <Text
                style={[
                  styles.optionDesc,
                  current.id === 1 ? styles.textLeft : styles.textCenter,
                ]}
              >
                {option.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          disabled={currentQuestion === 0}
        >
          <Text
            style={[styles.backText, currentQuestion === 0 && { opacity: 0.5 }]}
          >
            ← Back
          </Text>
        </TouchableOpacity>

        {currentQuestion === totalQuestions - 1 ? (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleSubmit}
            disabled={!answers[current.id]}
          >
            <Text style={styles.nextText}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            disabled={!answers[current.id]}
          >
            <Text style={styles.nextText}>Next →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  scrollContent: { paddingBottom: 20 },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F49CA5',
    marginBottom: 10,
  },
  question: { color: '#F49CA5', marginBottom: 5 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  desc: { color: '#AAA', marginBottom: 20 },
  option: {
    flexDirection: 'row',
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedOption: { borderColor: '#F49CA5', backgroundColor: '#FFF0F2' },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 15,
  },
  optionTitle: { fontWeight: '600', marginBottom: 2, marginLeft: 10 },
  optionDesc: { color: '#4b4b4bff', fontSize: 12, marginLeft: 10 },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  backButton: { paddingVertical: 10, paddingHorizontal: 20 },
  backText: { color: '#F49CA5' },
  nextButton: {
    backgroundColor: '#F49CA5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  nextText: { color: '#fff', fontWeight: '600' },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#EEE',
    borderRadius: 3,
    marginVertical: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F49CA5',
    borderRadius: 3,
  },
  imageRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  iconImage: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 20,
  },
  textLeft: { textAlign: 'left' },
  textCenter: { textAlign: 'center' },
});

export default SkinQuiz;
