import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Navbar from '../Components/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/FontAwesome5';

const EditRoutine = ({ navigation }) => {
  const [active, setActive] = useState('Calendar');
  const [activeTab, setActiveTab] = useState('Morning');
  const [activeRoutineTab, setActiveRoutineTab] = useState('Daily');
  const [routineData, setRoutineData] = useState(allRoutineData);

  const allRoutineData = [
    {
      id: 1,
      type: 'Daily',
      time: 'Morning',
      step: 'Step 1: Cleanser',
      product: 'Azarine Sunscreen Gel',
      exp: 'Exp in 1 yr',
      date: '08:00',
      image: require('../../assets/product-image.png'),
    },
    {
      id: 2,
      type: 'Daily',
      time: 'Morning',
      step: 'Step 2: Toner',
      product: 'Some By Mi Toner',
      exp: 'Exp in 8 mo',
      date: '08:05',
      image: require('../../assets/product-placeholder.jpg'),
    },
    {
      id: 3,
      type: 'Daily',
      time: 'Night',
      step: 'Step 1: Cleanser',
      product: 'Wardah Facial Wash',
      exp: 'Exp in 1 yr 1 mo',
      date: '20:00',
      image: require('../../assets/product-placeholder.jpg'),
    },
    {
      id: 4,
      type: 'Weekly',
      time: 'Morning',
      step: 'Step 1: Cleanser',
      product: 'Weekly Cleanser',
      exp: 'Exp in 6 mo',
      date: '08:00',
      image: require('../../assets/product-placeholder.jpg'),
    },
    {
      id: 5,
      type: 'Custom',
      time: 'Morning',
      step: 'Step 1: Exfoliation',
      product: 'Custom Exfoliation',
      exp: 'Exp in 3 mo',
      date: '08:00',
      image: require('../../assets/product-placeholder.jpg'),
    },
  ];

  const currentData = allRoutineData.filter(
    item => item.type === activeRoutineTab && item.time === activeTab,
  );

  const renderCard = item => (
    <View key={item.id} style={[styles.card, item.done && styles.cardDone]}>
      <View style={styles.infoBox}>
        {item.image && (
          <Image source={item.image} style={styles.productImage} />
        )}
        <View style={styles.info}>
          <Text style={styles.step}>{item.step}</Text>
          <Text style={styles.product}>{item.product}</Text>
          <Text style={styles.exp}>{item.exp}</Text>
        </View>
        <View style={{ marginLeft: 'auto', gap: 10, marginRight: 10 }}>
          <TouchableOpacity style={{ backgroundColor: '#ffffff', borderRadius: 30, padding: 7 }}>
            <Icon name="pencil" size={18} color="#E07C8E" />
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: '#ffffff', borderRadius: 30, padding: 7 }}>
            <Icon name="trash" size={18} color="#E07C8E" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={{ marginBottom: 90 }}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
            My Skincare Routine
          </Text>

          {/* Routine Toggle */}
          <View style={styles.routineToggleWrapper}>
            {['Daily', 'Weekly', 'Custom'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.routineToggleButton,
                  activeRoutineTab === tab && styles.activeRoutineTab,
                ]}
                onPress={() => setActiveRoutineTab(tab)}
              >
                <Text
                  style={{
                    color: activeRoutineTab === tab ? '#fff' : '#999',
                    fontWeight: 'bold',
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Routine Panel */}
        <View
          style={{
            padding: 15,
            margin: 16,
            backgroundColor: '#b4b4b4ff',
            borderRadius: 20,
          }}
        >
          {/* Toggle */}
          <View style={styles.toggleWrapper}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                activeTab === 'Morning' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('Morning')}
            >
              <Icon1
                name="sun"
                size={20}
                color={activeTab === 'Morning' ? 'orange' : 'gray'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                activeTab === 'Night' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('Night')}
            >
              <Icon1
                name="moon"
                size={20}
                color={activeTab === 'Night' ? 'blue' : 'gray'}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{activeTab} Routine</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddProduct')}>
            <Text style={styles.progress}>+ Add Product</Text>
          </TouchableOpacity>

          {currentData.length === 0 ? (
            <Text
              style={{
                textAlign: 'center',
                marginVertical: 30,
                color: '#000000ff',
              }}
            >
              No data available
            </Text>
          ) : (
            currentData.map(item => renderCard(item))
          )}
        </View>
      </ScrollView>

      {/* Navbar */}
      {/* <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <Navbar active={active} onPress={setActive} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  routineToggleWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#8f4141ff',
    borderRadius: 25,
    marginTop: 15,
    marginBottom: 10,
    overflow: 'hidden',
  },
  routineToggleButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#8f4141ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeRoutineTab: {
    backgroundColor: '#ae02c9ff',
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cardDone: {
    opacity: 0.8,
    backgroundColor: '#f5a7f5ff',
    borderRadius: 12,
  },
  date: {
    marginTop: 40,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 40,
  },
  productImage: {
    width: 50,
    height: 70,
    // borderBottomLeftRadius: 8,
    // borderTopLeftRadius: 8,
    borderRadius: 8,
    backgroundColor: '#000000ff',
    marginRight: 10,
  },
  toggleWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#8f4141ff',
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 15,
  },
  toggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#8f4141ff',
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: '#fff',
    borderRadius: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E06287',
    marginBottom: 40,
    textAlign: 'center',
  },
  progress: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    color: '#E06287',
    marginBottom: 15,
    fontWeight: 'bold',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#FDE5EB',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    color: '#666',
    fontSize: 12,
  },
  product: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E06287',
  },
  exp: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
});

export default EditRoutine;
