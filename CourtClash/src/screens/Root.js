// SETUP
import React, {useEffect, useState} from 'react';

// UI
import {StyleSheet, View, Image} from 'react-native';
import {
  Surface,
  Button,
  TextInput,
  ActivityIndicator,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// CONTEXT
import {UserContext} from '@contexts';

// FUNCTIONS
import {createOrGetUser} from '@functions/api/user';

const Root = ({navigation}) => {
  const {user, loginWithMagicLink, logout, getUser} =
    React.useContext(UserContext);
  const RootImage = require('@assets/images/root-image.png');
  const logo = require('@assets/images/logo-words.png');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      createOrGetUser(user.email)
        .then(res => {
          console.log('called createOrGetUser', user);
          setLoading(false);
          getUser(res.data.data.data);
          navigation.replace('App');
        })
        .catch(e => {
          console.log('Create Or Get User Failed: ', e);
          setLoading(false);
        });
    } else {
      console.log('No User: Not Logged On');
      setLoading(false);
    }
  }, [user]);

  const login = () => {
    loginWithMagicLink(email);
  };

  return (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={['#F24607', '#0D0D0D', '#0D0D0D', '#0D0D0D', '#A6121F']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={{
          height: '100%',
          justifyContent: 'space-between',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1,
        }}>
        <KeyboardAwareScrollView>
          <Image style={styles.logo} source={logo} />
          <Image source={RootImage} style={styles.imageBackground} />

          <Surface elevation={5} style={styles.surface}>
            {loading ? (
              <ActivityIndicator animating={true} color={'#f7c77e'} />
            ) : (
              <>
                <TextInput
                  label="Email"
                  value={email}
                  type="outlined"
                  onChangeText={text => setEmail(text)}
                  dense
                  style={{
                    marginBottom: 15,
                    backgroundColor: 'black',
                    borderColor: '#f7c77e',
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                  contentStyle={{color: '#f7c77e'}}
                  theme={{colors: {primary: '#f7c77e'}}}
                  activeOutlineColor="#f7c77e"
                  outlineColor="#f7c77e"
                  textColor="#f7c77e"
                  selectionColor="#f7c77e"
                />

                <Button
                  mode="contained"
                  style={{backgroundColor: '#f7c77e'}}
                  labelStyle={{fontWeight: 'bold', fontSize: 18}}
                  onPress={() => login()}>
                  Login / Register
                </Button>
              </>
            )}
          </Surface>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: '180%',
    height: '45%',
    aspectRatio: 1,
    zIndex: 2,
    right: 40,
    bottom: 10,
  },
  logo: {
    alignSelf: 'center',
    top: '5%',
    width: 200,
    height: 200,
  },
  surface: {
    padding: 20,
    backgroundColor: 'black',
    borderRadius: 15,
    bottom: 20,
    alignSelf: 'center',
    width: 280,
  },
});

export default Root;
