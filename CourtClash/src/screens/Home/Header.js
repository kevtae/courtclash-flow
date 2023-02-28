// SETUP
import React from 'react';

// UI
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import {Avatar, Text} from 'react-native-paper';

const Header = ({navigation, user}) => {
  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('Profile')}>
      <View
        style={{
          alignSelf: 'flex-end',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={{color: 'white'}}>{user.email}</Text>
          <Text style={{color: 'white'}}>0x{user.address}</Text>
        </View>
        <View
          style={{
            marginLeft: 10,
            padding: 2,
            backgroundColor: 'white',
            borderRadius: 25,
          }}>
          <Avatar.Image
            size={40}
            style={{
              borderColor: 'white',
            }}
            source={{
              uri: 'https://cdn.discordapp.com/attachments/981697635591290970/1078871993866264576/DL_I_want_to_a_generic_profile_icon_that_is_a_basketball_hooper_47f43156-2582-4933-8661-476deca518c9.png',
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({});

export default Header;
