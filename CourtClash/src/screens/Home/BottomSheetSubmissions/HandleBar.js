// SETUP
import React from 'react';

// UI
import {StyleSheet, View} from 'react-native';

const HandleBar = ({}) => {
  return (
    <View style={[styles.handle, {backgroundColor: 'black'}]}>
      <View style={[styles.handleBar]} />
    </View>
  );
};

const styles = StyleSheet.create({
  handle: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 15,
  },
  handleBar: {
    width: '15%',
    backgroundColor: 'white',
    height: 7,
    borderRadius: 5,
  },
});

export default HandleBar;
