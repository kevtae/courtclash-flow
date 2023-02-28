// SETUP
import React from 'react';

// UI
import {StyleSheet, View, Image} from 'react-native';

const Images = ({topshotItem}) => {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        flexDirection: 'row',
        marginTop: 20,
      }}>
      {topshotItem.Image.slice(1).map((item, i) => {
        return (
          <Image
            key={i}
            style={{
              borderColor: '#F24607',
              borderWidth: 1,
              width: 55,
              aspectRatio: 1,
              marginRight: 8,
              borderRadius: 5,
            }}
            source={{uri: item}}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Images;
