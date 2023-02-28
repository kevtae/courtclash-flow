// SETUP
import React, {useState} from 'react';

// UI
import {
  StyleSheet,
  View,
  ScrollView,
  Linking,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import {DataTable, Banner, Text, ActivityIndicator} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';

// COMPONENTS
import Stat from '@screens/Home/BottomSheetSubmissions/Stat';

// CONTEXT
import {UserContext} from '@contexts';

// FUNCTIONS
import {submitChallenge} from '@functions/api/challenge';

const Row = ({label, value}) => {
  return (
    <DataTable.Row style={{justifyContent: 'space-between'}}>
      <DataTable.Cell textStyle={{color: 'white'}}>{label}</DataTable.Cell>
      <DataTable.Cell textStyle={{color: 'white'}}>{value}</DataTable.Cell>
    </DataTable.Row>
  );
};

const ClashSubmitted = ({navigation, route}) => {
  const {videoUrl, challengeId} = route.params;
  const {userDB} = React.useContext(UserContext);

  const [banner, setBanner] = useState(false);
  const [transactionUrl, setTransactionUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const openTransctionURL = () => {
    Linking.openURL(transactionUrl).catch(e =>
      console.log('Opening Transaction Link Failed: ', e),
    );
  };

  const onFinish = () => {
    setLoading(true);
    submitChallenge(userDB.ID, challengeId, videoUrl)
      .then(res => {
        setBanner(true);
        setTransactionUrl(res.data.data.data);
        console.log('Challenge submission success: ', res.data.data.data);
        setLoading(false);
      })
      .catch(e => {
        console.log('Challenge Submission Error: ', e);
        setLoading(false);
      });
  };

  const goToHome = () => {
    setBanner(false);
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  return (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={['#F24607', '#0D0D0D', '#0D0D0D', '#0D0D0D', '#A6121F']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={{flex: 1, height: '100%'}}>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={{alignItems: 'center', paddingTop: '10%'}}>
            <Stat title="USDC Staked" value={2} />
            {/* <TouchableOpacity onPress={openTransctionURL}>
            <Text style={styles.viewTransaction}>View Transaction</Text>
          </TouchableOpacity> */}
            <DataTable style={{width: '80%', marginTop: 20}}>
              <Row label="Email" value={userDB.email} />
              <Row label="Address" value={userDB.address} />
              {/* <Row label="Contract" value="0x8gs7ahs7hd9ash" /> */}
            </DataTable>
            <Video
              source={{
                //   uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                uri: videoUrl,
              }}
              style={styles.video}
              rate={1.0}
              volume={1.0}
              muted={false}
              resizeMode="cover"
              repeated
            />
            {!banner && loading ? (
              <ActivityIndicator
                animating={true}
                color={'#f7c77e'}
                style={{marginTop: 20}}
              />
            ) : (
              <TouchableOpacity onPress={onFinish} style={styles.button}>
                <Image
                  source={{
                    uri: 'https://i.ibb.co/VMp6Zjc/Copy-of-Druzhba-Retro-removebg-preview.png',
                  }}
                  style={styles.clashImage}
                />
              </TouchableOpacity>
            )}
          </ScrollView>
          <Banner
            visible={banner}
            style={{backgroundColor: 'black'}}
            actions={[
              {
                label: 'Go To Home',
                labelStyle: {color: '#F24607'},
                onPress: goToHome,
              },
              {
                label: 'View Transaction',
                labelStyle: {color: '#F24607'},
                onPress: openTransctionURL,
              },
            ]}
            icon={({size}) => (
              <Image
                source={{
                  uri: 'https://i.ibb.co/QbtR3ZN/My-project-3.png',
                }}
                style={{
                  width: size,
                  height: size,
                }}
              />
            )}>
            <Text style={{color: 'white'}}>
              You've successfuly entered the Clash, and your USDC has been
              staked!
            </Text>
          </Banner>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewTransaction: {
    color: '#ffae00',
    padding: 3,
    paddingHorizontal: 6,
    borderWidth: 0.5,
    borderWidth: 1,
    borderColor: '#ffae00',
    marginTop: 10,
    borderRadius: 3,
  },
  video: {
    width: 175,
    height: 300,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#f7f4d2',
    marginTop: 30,
  },
  button: {
    width: '40%',
    padding: 8,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ffae00',
    marginHorizontal: '5%',
    marginTop: 20,
  },
  clashImage: {
    width: '100%',
    aspectRatio: 4.07,
    alignSelf: 'center',
  },
});

export default ClashSubmitted;
