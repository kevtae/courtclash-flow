// SETUP
import React from 'react';

// NAVIGATION
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// SCREENS //
// Auth
import Home from '@screens/Home';
import Record from '@screens/Record';
import ClashSubmitted from '@screens/ClashSubmitted';
import Profile from '@screens/Profile';

const Stack = createNativeStackNavigator();

const AppStack = () => {
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
      <Stack.Screen
        options={{headerShown: false}}
        name="Profile"
        component={Profile}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="ClashSubmitted"
        component={ClashSubmitted}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
