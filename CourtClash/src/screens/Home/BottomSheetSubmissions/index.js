// SETUP
import React, {
  useState,
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

// COMPONENTS
import HandleBar from './HandleBar';
import Stat from './Stat';
import CarouselSubmissions from './CarouselSubmissions';

const BottomSheetSubmissions = forwardRef((props, ref) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['95%'], []);

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
          <Stat title="USDC Staked" value="23,417" />

          <CarouselSubmissions />
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Record')}
            style={styles.button}>
            <Image
              source={{
                // uri: 'https://i.ibb.co/M5LqnNC/Druzhba-Retro-3-removebg-preview.png',
                uri: 'https://i.ibb.co/fkXH81n/Druzhba-Retro-4-removebg-preview.png',
              }}
              style={styles.clashImage}
            />
          </TouchableOpacity>
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
