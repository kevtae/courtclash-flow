// SETUP
import React from 'react';

// NAVIGATION
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// SCREENS //
// Auth
import Home from '@screens/Home';
import Record from '@screens/Record';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        options={{headerShown: false}}
        name="Home"
        component={Home}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Record"
        component={Record}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
