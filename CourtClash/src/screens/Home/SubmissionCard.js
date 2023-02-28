import React from 'react';
import {TouchableOpacity} from 'react-native';
import Video from 'react-native-video';

const SubmissionCard = ({
  navigation,
  openSubmissions,
  submissions,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (submissions) {
          openSubmissions();
          onPress(submissions);
        }
      }}
      style={{
        flex: 1,
        backgroundColor: 'black',
        height: 150,
        borderRadius: 10,
      }}>
      {submissions && submissions.length !== 0 && (
        <Video
          source={{uri: submissions[0].videoLink}}
          style={{flex: 1, borderRadius: 10}}
          rate={1.0}
          volume={1.0}
          muted={false}
          resizeMode="cover"
          paused
          repeat
        />
      )}
    </TouchableOpacity>
  );
};

export default SubmissionCard;
