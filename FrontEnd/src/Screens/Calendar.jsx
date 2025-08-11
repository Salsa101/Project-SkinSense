import { React, useState } from 'react';
import { View, Text } from 'react-native';
import Navbar from '../Components/Navbar';

const Calendar = () => {
  const [active, setActive] = useState('Calendar');

  return (
    <View style={{ flex: 1 }}>
      <Text>INI HALAMAN CALENDAR</Text>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <Navbar active={active} onPress={setActive} />
      </View>
    </View>
  );
};

export default Calendar;
