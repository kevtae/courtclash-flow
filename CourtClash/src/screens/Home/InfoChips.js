// SETUP
import React from 'react';

// UI
import {StyleSheet, View} from 'react-native';
import {Chip} from 'react-native-paper';

const InfoChips = ({navigation}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        <Chip
          style={{backgroundColor: '#A6121F'}}
          textStyle={{color: 'white'}}
          onPress={() => console.log('Pressed')}>
          Dec 8, 2022
        </Chip>
        <Chip
          style={{backgroundColor: '#F24607'}}
          textStyle={{color: 'white'}}
          onPress={() => console.log('Pressed')}>
          Block
        </Chip>
        <Chip
          style={{backgroundColor: '#E1862F'}}
          textStyle={{color: 'white'}}
          onPress={() => console.log('Pressed')}>
          NBA Top Shot
        </Chip>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default InfoChips;
