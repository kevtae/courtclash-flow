// SETUP
import React from 'react';

// UI
import {StyleSheet, View} from 'react-native';
import {Avatar, Text} from 'react-native-paper';

const Header = ({navigation}) => {
  return (
    <View
      style={{
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Avatar.Image
        size={30}
        style={{
          borderColor: '#F24607',
          borderWidth: 1,
          marginRight: 10,
        }}
        source={{
          uri: 'https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg ',
        }}
      />
      <View>
        <Text style={{color: 'white'}}>Hooper #45</Text>
        <Text style={{color: 'white'}}>0xea...2c6c</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Header;
