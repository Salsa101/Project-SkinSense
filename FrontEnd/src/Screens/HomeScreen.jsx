import React from 'react';
import { View, Text, Button} from 'react-native';

const HomeScreen = ({navigation}) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Ini Home Screen</Text>
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate('SignUp')}
      />
    </View>
  );
};

export default HomeScreen;
