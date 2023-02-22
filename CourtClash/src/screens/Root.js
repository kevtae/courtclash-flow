// SETUP
import React, {useEffect, useState} from 'react';

// UI
import {StyleSheet, View, ImageBackground, Image} from 'react-native';
import {Surface, Button, Text} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

// CONTEXT
import {UserContext} from '@contexts';

const Root = ({navigation}) => {
  // const {user, loginWithMagicLink, logout} = React.useContext(UserContext);
  const RootImage = require('@assets/images/root-image.png');
  const logo = require('@assets/images/logo-words.png');

  return (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={['#F24607', '#0D0D0D', '#0D0D0D', '#0D0D0D', '#A6121F']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground source={RootImage} style={styles.imageBackground} />
      </LinearGradient>
      <Image style={styles.logo} source={logo} />
      <Surface elevation={5} style={styles.surface}>
        <Button mode="contained" onPress={() => navigation.navigate('App')}>
          Press me
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: '125%',
    right: '26%',
    aspectRatio: 1,
    marginBottom: '33%',
  },
  logo: {
    position: 'absolute',
    alignSelf: 'center',
    top: '5%',
    width: 200,
    height: 200,
  },
  surface: {
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 15,
    position: 'absolute',
    bottom: 0,
    bottom: '5%',
    alignSelf: 'center',
  },
});

export default Root;
