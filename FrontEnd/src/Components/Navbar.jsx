import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const Navbar = (active, onPress) => {
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
        const isCenter = item.name === 'SkinQuiz';

        return (
          <TouchableOpacity
            key={index}
            style={[styles.item, isCenter && styles.centerWrapper]}
            onPress={() => navigation.navigate(item.name)}
          >
            {isCenter ? (
              <View style={styles.centerButton}>
                <Icon name={item.icon} size={30} color="#fff" />
              </View>
            ) : (
              <>
                <Icon
                  name={item.icon}
                  size={28}
                  color={isActive ? '#a05c5c' : '#aaa'}
                />
                <Text style={[styles.label, isActive && styles.activeLabel]}>
                  {item.name}
                </Text>
              </>
            )}
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
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  item: {
    flex: 1,
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
  centerWrapper: {
    position: 'relative',
    top: -28, // naik dari navbar
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#a05c5c',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default Navbar;
