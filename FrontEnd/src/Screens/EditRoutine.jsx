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
          <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: '#E07C8E' }}>
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
                    color: activeRoutineTab === tab ? '#fff' : '#B67F89',
                    fontFamily: 'Poppins-Bold',
                    fontSize: 14,
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
            backgroundColor: '#FFF9F3',
            borderRadius: 20,
            shadowColor: '#AB8C8C',
            shadowOffset: {
             width: 0,
             height: 4,
          },
             shadowOpacity: 0.5,
             shadowRadius: 4,
             elevation: 4,
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
                color={activeTab === 'Morning' ? '#E07C8E' : '#DBABB3'}
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
                color={activeTab === 'Night' ? '#E07C8E' : '#DBABB3'}
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
                color: '#B67F89',
                fontFamily: 'Poppins-Medium',
                fontSize: 11,
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
    backgroundColor: '#F8D3D5',
    borderRadius: 25,
    marginTop: 15,
    marginBottom: 10,
    overflow: 'hidden',
    boxShadow: '0px 2px 4px rgba(170, 162, 162, 0.3)',
  },
  routineToggleButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F8D3D5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeRoutineTab: {
    backgroundColor: '#E07C8E',
  },
  container: {
    flex: 1,
    backgroundColor: '#FCF7F2'
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cardDone: {
    opacity: 0.8,
    backgroundColor: '#E07C8E',
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
    backgroundColor: '#F8D3D5',
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 15,
  },
  toggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F8D3D5',
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: '#fff',
    borderRadius: 25,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#E06287',
    marginBottom: 40,
    textAlign: 'center',
  },
  progress: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 12,
    color: '#E06287',
    marginBottom: 15,
   fontFamily: 'Poppins-Bold',
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
