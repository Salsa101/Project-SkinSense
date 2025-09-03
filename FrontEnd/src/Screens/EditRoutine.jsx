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

import api from '../api';

const EditRoutine = ({ navigation }) => {
  const [active, setActive] = useState('Calendar');
  const [activeTab, setActiveTab] = useState('Morning');
  const [activeRoutineTab, setActiveRoutineTab] = useState('Daily');
  const [routineData, setRoutineData] = useState([]);

  const fetchRoutine = async () => {
    try {
      const response = await api.get(
        `/routine-products/view/${activeRoutineTab.toLowerCase()}/${activeTab.toLowerCase()}`,
      );
      setRoutineData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoutine();
  }, [activeRoutineTab, activeTab]);

  const currentData = routineData;

  const renderCard = item => (
    <View key={item.id} style={[styles.card, item.done && styles.cardDone]}>
      <View style={styles.infoBox}>
        <Image
          source={
            item.Product?.productImage
              ? { uri: `http://10.0.2.2:3000${item.Product.productImage}` }
              : require('../../assets/product-placeholder.jpg')
          }
          style={styles.productImage}
        />
        <View style={styles.info}>
          <Text style={styles.step}>Step {item.Product?.productStep}</Text>
          <Text style={styles.product}>{item.Product?.productName}</Text>
          <Text style={styles.exp}>Exp: {item.Product?.expirationDate}</Text>
        </View>
        <View style={{ marginLeft: 'auto', gap: 10, marginRight: 10 }}>
          <TouchableOpacity
            style={{ backgroundColor: '#ffffff', borderRadius: 30, padding: 7 }}
          >
            <Icon name="pencil" size={18} color="#E07C8E" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: '#ffffff', borderRadius: 30, padding: 7 }}
          >
            <Icon name="trash" size={18} color="#E07C8E" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={{ marginBottom: 90 }}>
        <View style={styles.headerContainer}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
            My Skincare Routine
          </Text>

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

        <View
          style={{
            padding: 15,
            margin: 16,
            backgroundColor: '#b4b4b4ff',
            borderRadius: 20,
          }}
        >
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
