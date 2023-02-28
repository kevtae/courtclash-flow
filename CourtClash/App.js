// SETUP
import React from 'react';

// UI
import {
  Provider as PaperProvider,
  Portal as PaperPortal,
} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// NAVIGATION
import {NavigationContainer} from '@react-navigation/native';
import MainStack from '@stacks/MainStack';

// PAYMENTS
import {StripeProvider} from '@stripe/stripe-react-native';
import {STRIPE_PUBLISHABLE_KEY, STRIPE_MERCHANT_ID} from '@env';

// CONTEXT
import {UserProvider} from '@contexts';

const App = () => {
  return (
    <PaperProvider>
      <PaperPortal>
        <StripeProvider
          publishableKey={STRIPE_PUBLISHABLE_KEY}
          merchantIdentifier={STRIPE_MERCHANT_ID}>
          <SafeAreaProvider>
            <UserProvider>
              <NavigationContainer>
                <MainStack />
              </NavigationContainer>
            </UserProvider>
          </SafeAreaProvider>
        </StripeProvider>
      </PaperPortal>
    </PaperProvider>
  );
};

export default App;
