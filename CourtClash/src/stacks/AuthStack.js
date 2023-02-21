// SETUP
import React from 'react';

// NAVIGATION
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// SCREENS //
// Auth
import Root from '@screens/Root';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Root">
      <Stack.Screen
        options={{headerShown: false}}
        name="Root"
        component={Root}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
