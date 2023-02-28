// SETUP
import React, {useEffect, useState} from 'react';

// UI
import {StyleSheet, View, SafeAreaView, FlatList} from 'react-native';
import {Text, Avatar, Button} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Video from 'react-native-video';

// CONTEXT
import {UserContext} from '@contexts';

// FUNCTIONS
import {getUserSubmissions} from '@functions/api/challenge';
import {getUserFunds} from '@functions/api/user';

// COMPONENTS
import Stat from '@screens/Home/BottomSheetSubmissions/Stat';

const Profile = ({navigation}) => {
  const {user, userDB, logout} = React.useContext(UserContext);
  const [usdc, setUsdc] = useState(0);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    getUserSubmissions(userDB.ID)
      .then(res => {
        if (res.data.data.data !== null) {
          setSubmissions(res.data.data.data);
        }
      })
      .catch(e => {
        console.log('Get User Submissions Error: ', e);
      });
  }, []);

  useEffect(() => {
    getUserFunds(userDB.address)
      .then(res => {
        setUsdc(res.data.data.data);
      })
      .catch(e => {
        console.log('Get User Funds Error: ', e);
      });
  }, []);

  const onLogout = () => {
    logout();
    navigation.replace('Auth');
  };

  const renderVideo = (item, i) => {
    return (
      <Video
        source={{
          uri: item.item.videoLink,
        }}
        style={styles.video}
        rate={1.0}
        volume={1.0}
        muted={false}
        resizeMode="cover"
        paused
        repeated
      />
    );
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
          top: 0,
          left: 0,
          width: '100%',
        }}>
        {/* <KeyboardAwareScrollView> */}
        <SafeAreaView style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: 10,
            }}>
            <Button
              labelStyle={{color: 'white', fontWeight: 'bold', fontSize: 16}}
              onPress={() => navigation.goBack()}>
              ← Back
            </Button>
            <Button
              variant="outlined"
              labelStyle={{color: 'red', fontWeight: 'bold', fontSize: 16}}
              onPress={() => onLogout()}>
              Logout
            </Button>
          </View>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 100,
                padding: 2,
              }}>
              <Avatar.Image
                size={100}
                source={{
                  uri: 'https://cdn.discordapp.com/attachments/981697635591290970/1078871993866264576/DL_I_want_to_a_generic_profile_icon_that_is_a_basketball_hooper_47f43156-2582-4933-8661-476deca518c9.png',
                }}
              />
            </View>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                marginTop: 20,
                marginBottom: 10,
              }}>
              {userDB.email}
            </Text>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              0x{userDB.address}
            </Text>
            <Stat title="USDC Amount" value={usdc / 100000000} />
          </View>
          <Text
            variant="titleLarge"
            style={{
              fontWeight: 'bold',
              color: 'white',
              marginLeft: 10,
              marginTop: 30,
            }}>
            Submissions
          </Text>
          <FlatList
            data={submissions}
            renderItem={renderVideo}
            keyExtractor={item => item.ID}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            style={{width: '100%', paddingHorizontal: '2%'}}
          />
        </SafeAreaView>
        {/* </KeyboardAwareScrollView> */}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  surface: {
    alignItems: 'center',
  },
  video: {
    width: '30%',
    aspectRatio: 0.58333,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#f7f4d2',
    margin: '1%',
  },
});

export default Profile;
