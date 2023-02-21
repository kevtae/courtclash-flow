// SETUP
import React from 'react';
import {StyleSheet} from 'react-native';

// UI
import {
  Provider as PaperProvider,
  Portal as PaperPortal,
} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// NAVIGATION
import {NavigationContainer} from '@react-navigation/native';
import MainStack from '@stacks/MainStack';

// CONTEXT
import {UserProvider} from '@contexts';

const App = () => {
  return (
    <PaperProvider>
      <PaperPortal>
        <SafeAreaProvider>
          <UserProvider>
            <NavigationContainer>
              <MainStack />
            </NavigationContainer>
          </UserProvider>
        </SafeAreaProvider>
      </PaperPortal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
