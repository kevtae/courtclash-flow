// SETUP
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';

// UI
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Text} from 'react-native-paper';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';

// STRIPE
import {useStripe} from '@stripe/stripe-react-native';

// COMPONENTS
import HandleBar from './HandleBar';
import Stat from './Stat';
import CarouselSubmissions from './CarouselSubmissions';

// FUNCTIONS
import {has} from 'lodash';
// api
import {getPaymentInfo} from '@functions/api/stripe';
import {getTotalStaked} from '@functions/api/stake';

// CONTEXT
import {UserContext} from '@contexts';

const BottomSheetSubmissions = forwardRef((props, ref) => {
  const {userDB} = React.useContext(UserContext);
  const {presentPaymentSheet, initPaymentSheet} = useStripe();
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['95%'], []);
  const [loading, setLoading] = useState(false);
  const [staked, setStaked] = useState(0);
  const [currentVideo, setCurrentVideo] = useState();

  console.log('currentChallenge---', props.currentChallenge);

  useEffect(() => {
    getTotalStaked().then(res => {
      setStaked(res.data.data.data);
    });
  }, []);

  useImperativeHandle(ref, () => ({
    openSheet() {
      bottomSheetRef.current.present();
    },
  }));

  const handleSheetChanges = useCallback(index => {
    // handle when snappoints change
  }, []);

  const renderBackdrop = backdropProps => (
    <TouchableOpacity
      onPress={() => bottomSheetRef.current.dismiss()}
      {...backdropProps}
    />
  );

  const onEnterClash = () => {
    setLoading(true);
    getPaymentInfo(userDB.address)
      .then(res => {
        console.log('getPaymentInfo: ', res.data.data);
        const {clientSecret, ephemeralKey, customer} = res.data.data;
        initializePaymentSheet(clientSecret, ephemeralKey, customer);
      })
      .catch(err => {
        console.log('Get Payment Info Failed: ', err);
        setLoading(false);
      });
  };

  const initializePaymentSheet = (clientSecret, ephemeralKey, customer) => {
    initPaymentSheet({
      //   customerId: customer,
      //   customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Cambit',
      //   applePay: true,
      //   googlePay: true,
      merchantCountryCode: 'US',
    })
      .then(res => {
        console.log('Success: Initiated Payment Sheet', res);
        openPaymentSheet(clientSecret, ephemeralKey, customer);
      })
      .catch(err => {
        console.log('Failed: Initiated Payment Sheet');
        setLoading(false);
      });
  };

  const openPaymentSheet = (clientSecret, ephemeralKey, customer) => {
    presentPaymentSheet({clientSecret})
      .then(res => {
        if (has(res, 'paymentOption')) {
          // nav to the record screen
          console.log('currentChallenge--', props.currentChallenge);
          props.navigation.navigate('Record', {
            challengeId: props.currentChallenge,
          });
        }
      })
      .catch(err => {
        console.log('err', err);
        // payment didn't go through
        // sendError('Purchase Failed', "Something when wrong with the payment");
      });
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      handleComponent={() => <HandleBar />}
      snapPoints={snapPoints}
      stackBehavior="push"
      backdropComponent={renderBackdrop}
      onChange={handleSheetChanges}>
      <BottomSheetScrollView
        contentContainerStyle={{flex: 1}}
        style={{backgroundColor: 'black'}}>
        <LinearGradient
          locations={[0, 0.25, 0.5, 0.9, 1]}
          colors={[
            'rgba(13,13,13,0)',
            'rgba(13,13,13,0)',
            'rgba(13,13,13,0)',
            'rgba(166,18,31,0.6)',
            'rgba(240,70,7,0.6)',
          ]}
          style={{flex: 1, alignItems: 'center'}}>
          <Text
            variant="titleLarge"
            style={{color: 'white', fontWeight: 'bold'}}>
            Recent Clashes
          </Text>
          <Stat title="USDC Staked" value={staked / 100000000} />

          <CarouselSubmissions
            currentSubmissions={props.currentSubmissions}
            {...{setCurrentVideo}}
          />
          {props.currentChallenge == '63f91efb6322941ff43065c1' ? (
            <TouchableOpacity onPress={onEnterClash} style={styles.button}>
              <Image
                source={{
                  uri: 'https://i.ibb.co/fkXH81n/Druzhba-Retro-4-removebg-preview.png',
                }}
                style={styles.clashImage}
              />
            </TouchableOpacity>
          ) : (
            <Text
              style={{
                color: 'red',
                fontWeight: 'bold',
                fontSize: 24,
                borderWidth: 0.5,
                borderColor: 'red',
                borderRadius: 5,
                padding: 10,
              }}>
              Challenge Ended
            </Text>
          )}
        </LinearGradient>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  button: {
    width: '90%',
    padding: 8,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ffae00',
    marginHorizontal: '5%',
  },
  clashImage: {
    width: '100%',
    aspectRatio: 8.87,
    alignSelf: 'center',
  },
});

export default BottomSheetSubmissions;
