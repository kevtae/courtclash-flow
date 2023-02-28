// SETUP
import React from 'react';

// UI
import {StyleSheet, View, Linking} from 'react-native';
import {Chip} from 'react-native-paper';

const InfoChips = ({topshotItem}) => {
  const dateString = topshotItem.date;
  const date = new Date(dateString);
  const options = {month: 'short', day: 'numeric', year: 'numeric'};
  const formattedDate = date.toLocaleDateString('en-US', options);

  function openUrl(url) {
    Linking.openURL(url).catch(error =>
      console.error('An error occurred:', error),
    );
  }
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
        {topshotItem.challengeType !== 'Dribble' && (
          <Chip
            style={{backgroundColor: '#A6121F'}}
            textStyle={{color: 'white'}}
            onPress={() => console.log('Pressed')}>
            {formattedDate}
          </Chip>
        )}

        <Chip
          style={{backgroundColor: '#F24607'}}
          textStyle={{color: 'white'}}
          onPress={() => console.log('Pressed')}>
          {topshotItem.challengeType}
        </Chip>
        {topshotItem.challengeType !== 'Dribble' && (
          <Chip
            style={{backgroundColor: '#E1862F'}}
            textStyle={{color: 'white'}}
            onPress={() => openUrl(topshotItem.link)}>
            Top Shot
          </Chip>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default InfoChips;
