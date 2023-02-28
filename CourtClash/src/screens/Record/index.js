// SETUP
import React, {useEffect, useState} from 'react';

// UI
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {Surface, Button, Text} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {Camera} from 'react-native-vision-camera';

// COMPONENTS
import Permissions from './Permissions';
import CameraRecord from './CameraRecord';

const Record = ({navigation, route}) => {
  const {challengeId} = route.params;
  const [cameraPermission, setCameraPermission] = useState();
  const [microphonePermission, setMicrophonePermission] = useState();

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission);
    Camera.getMicrophonePermissionStatus().then(setMicrophonePermission);
  }, []);

  if (cameraPermission == null || microphonePermission == null) {
    // still loading
    return null;
  }

  const showPermissionsPage =
    cameraPermission !== 'authorized' ||
    microphonePermission === 'not-determined';

  return showPermissionsPage ? (
    <Permissions {...{navigation}} />
  ) : (
    <CameraRecord {...{navigation, challengeId}} />
  );
};

const styles = StyleSheet.create({});

export default Record;
