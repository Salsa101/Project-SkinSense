import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const Navbar = ({ active, onPress }) => {
  const navigation = useNavigation();
  const route = useRoute();

  const items = [
    { name: 'Home', icon: 'home' },
    { name: 'News', icon: 'lightbulb-outline' },
    { name: 'SkinQuiz', icon: 'crop-free' },
    { name: 'Calendar', icon: 'calendar-today' },
    { name: 'Journal', icon: 'menu-book' },
  ];

  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const isActive = route.name === item.name;
        return (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => navigation.navigate(item.name)}
          >
            <Icon
              name={item.icon}
              size={30}
              color={isActive ? "#a05c5c" : "#aaa"}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f9f4f0',
    paddingTop: 8,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  item: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
    fontFamily: 'Poppins-Medium',
  },
  activeLabel: {
    color: '#a05c5c',
    fontWeight: 'bold',
  },
});

export default Navbar;
