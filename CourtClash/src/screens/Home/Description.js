// SETUP
import React, {useState} from 'react';

// UI
import {StyleSheet, View, Image, TouchableWithoutFeedback} from 'react-native';
import {Text} from 'react-native-paper';

const Description = ({navigation, topshotItem}) => {
  const [seeMore, setSeeMore] = useState(false);

  const dateString = topshotItem.date;
  const date = new Date(dateString);
  const options = {month: 'short', day: 'numeric', year: 'numeric'};
  const formattedDate = date.toLocaleDateString('en-US', options);

  return (
    <View style={{flex: 3, marginRight: 5}}>
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
          source={{uri: topshotItem.Image[0]}}
        />
        <View>
          <Text
            variant="titleMedium"
            style={{
              color: 'white',
              fontWeight: 'bold',
              width: 200,
            }}>
            {topshotItem.name}
          </Text>
          <Text
            variant="titleSmall"
            style={{color: '#dedede', fontWeight: 'bold'}}>
            {formattedDate}
          </Text>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={() => setSeeMore(prev => !prev)}>
        <View>
          <Text
            variant="bodyMedium"
            style={{color: 'white', marginTop: 6, fontWeight: '600'}}>
            {seeMore
              ? topshotItem.description
              : `${topshotItem.description.substring(0, 100)}...`}
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              color: 'white',
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
