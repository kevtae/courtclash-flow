import React from 'react';
import {View, TouchableOpacity} from 'react-native';

const SubmissionCard = ({navigation, openSubmissions}) => {
  return (
    <TouchableOpacity
      onPress={openSubmissions}
      style={{
        flex: 1,
        backgroundColor: 'red',
        height: 150,
        borderRadius: 10,
      }}
    />
  );
};

export default SubmissionCard;
