// SETUP
import React, {useEffect, useState} from 'react';

// UI
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {Surface, Button, Text} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

// CONTEXT
import {UserContext} from '@contexts';

const Record = ({navigation}) => {
  // const {user, loginWithMagicLink, logout} = React.useContext(UserContext);
  const RootImage = require('@assets/images/root-image.png');
  const logo = require('@assets/images/logo-words.png');

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text>RECORD SCREEN</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default Record;
