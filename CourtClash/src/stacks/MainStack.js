// SETUP
import React from 'react';

// NAVIGATION
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// STACKS
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const Stack = createNativeStackNavigator();

const MainStack = ({}) => {
  return (
    <Stack.Navigator initialRouteName={'Auth'}>
      <Stack.Screen
        options={{headerShown: false}}
        name="Auth"
        component={AuthStack}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="App"
        component={AppStack}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
