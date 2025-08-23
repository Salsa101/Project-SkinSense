import { React, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Navbar from '../Components/Navbar';

import Icon from 'react-native-vector-icons/FontAwesome';

const Calendar = () => {
  const [active, setActive] = useState('Calendar');

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View>
          <View>
            <Text>Skincare Tracker</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 8,
              }}
            >
              <Icon name="calendar" size={20} color="#000000"/>
              <Text style={{ marginHorizontal: 8 }}>Januari 2025</Text>
              <Icon name="chevron-down" size={20} color="#000000"/>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Navbar tetap fixed di bawah */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <Navbar active={active} onPress={setActive} />
      </View>
    </View>
  );
};

export default Calendar;
