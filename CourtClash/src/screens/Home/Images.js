// SETUP
import React from 'react';

// UI
import {StyleSheet, View, Image} from 'react-native';

const Images = ({navigation}) => {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        flexDirection: 'row',
        marginTop: 20,
      }}>
      {[0, 0, 0, 0].map((item, i) => {
        return (
          <Image
            style={{
              borderColor: '#F24607',
              borderWidth: 1,
              width: 55,
              aspectRatio: 1,
              marginRight: 8,
              borderRadius: 5,
            }}
            source={{
              uri: 'https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg',
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Images;
