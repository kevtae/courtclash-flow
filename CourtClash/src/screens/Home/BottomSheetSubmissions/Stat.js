// SETUP
import React from 'react';

// UI
import {StyleSheet} from 'react-native';
import {Surface, Text} from 'react-native-paper';

const Stat = ({title, value}) => {
  return (
    <Surface elevation={5} style={styles.statSurface}>
      <Text variant="bodySmall" style={{color: '#fadd9d'}}>
        {title}
      </Text>
      <Text style={{color: '#ffae00', fontWeight: 'bold', fontSize: 30}}>
        {value.toFixed(2)}
      </Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  statSurface: {
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffae00',
    marginTop: 20,
  },
});

export default Stat;
