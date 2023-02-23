// SETUP
import React, {useState} from 'react';

// UI
import {StyleSheet, View, Image, TouchableWithoutFeedback} from 'react-native';
import {Text} from 'react-native-paper';

const Description = ({navigation, topshotItem}) => {
  const [seeMore, setSeeMore] = useState(false);

  return (
    <View style={{flex: 3}}>
      {/* DESCRIPTION */}
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={{
            borderColor: '#F24607',
            borderWidth: 1,
            width: 38,
            aspectRatio: 1,
            borderRadius: 5,
            marginRight: 10,
          }}
          source={{
            uri: 'https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg ',
          }}
        />
        <View>
          <Text
            variant="titleMedium"
            style={{color: 'white', fontWeight: 'bold'}}>
            @Evan Mobley
          </Text>
          <Text
            variant="titleSmall"
            style={{color: '#dedede', fontWeight: 'bold'}}>
            Dec 8, 2022
          </Text>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={() => setSeeMore(prev => !prev)}>
        <View>
          <Text variant="bodyMedium" style={{color: '#dedede', marginTop: 6}}>
            {seeMore
              ? topshotItem.user.description
              : topshotItem.user.description.substring(0, 100)}
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              color: '#dedede',
              marginTop: 8,
            }}>
            {seeMore ? 'See Less' : 'See More'}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Description;
