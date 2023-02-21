// SETUP
import React, {useEffect, useState} from 'react';

// UI
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import {
  Surface,
  Avatar,
  Text,
  SegmentedButtons,
  Chip,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import PagerView from 'react-native-pager-view';
import Video from 'react-native-video';

// CONTEXT
import {UserContext} from '@contexts';

const videos = [
  {
    id: 0,
    video:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    poster:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    user: {
      username: 'whinderssonnunes',
      description:
        'If elite-level rim protectors strike fear in their opponents, then Cleveland Cavaliers rookie Evan Mobley induces phobias. Patient and under control, the gifted young big man holds his ground as Zach LaVine attacks the paint, then calmly pries the rock away to stifle the possession. Mobley finished with 16 points, nine rebounds and five blocks in the December 8, 2021 victory.',
      music: 'som original',
      avatar: require('../assets/avatar/01.jpeg'),
    },
    count: {
      like: '1.1M',
      comment: '4080',
      share: '2800',
    },
  },
  {
    id: 1,
    video:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    user: {
      username: 'luismariz',
      description:
        'If elite-level rim protectors strike fear in their opponents, then Cleveland Cavaliers rookie Evan Mobley induces phobias. Patient and under control, the gifted young big man holds his ground as Zach LaVine attacks the paint, then calmly pries the rock away to stifle the possession. Mobley finished with 16 points, nine rebounds and five blocks in the December 8, 2021 victory.',
      music: 'som original',
      avatar: require('../assets/avatar/02.jpeg'),
    },
    count: {
      like: '380K',
      comment: '2388',
      share: '535',
    },
  },
];

const Home = ({navigation}) => {
  // const {user, loginWithMagicLink, logout} = React.useContext(UserContext);
  const [selected, setSelected] = useState(0);
  const [seeMore, setSeeMore] = useState(false);
  const [segmentedButton, setSegmentedButton] = useState();
  //   navigation.navigate('Verify', {number: formattedNumber, confirmation});

  return (
    <PagerView
      orientation="vertical"
      onPageSelected={e => setSelected(e.nativeEvent.position)}
      initialPage={0}
      style={{flex: 1}}>
      {videos.map((item, index) => {
        let isPlay = selected === index;
        return (
          <View key={index}>
            {isPlay ? (
              <Video
                source={{uri: item.video}}
                style={{flex: 1}}
                poster={item.poster}
                rate={1.0}
                volume={1.0}
                muted={false}
                resizeMode="cover"
              />
            ) : (
              <ImageBackground source={item.poster} style={{flex: 1}} />
            )}
            <LinearGradient
              locations={[0, 0.26, 0.6, 1]}
              colors={[
                'rgba(26,26,26,0.6)',
                'rgba(26,26,26,0)',
                'rgba(26,26,26,0)',
                'rgba(26,26,26,0.6)',
              ]}
              style={{
                height: '100%',
                justifyContent: 'space-between',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1,
              }}>
              <SafeAreaView style={{flex: 1, marginHorizontal: 20}}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                  }}>
                  {/* DESCRIPTION */}
                  <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        style={{
                          borderColor: 'white',
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
                    <TouchableWithoutFeedback
                      onPress={() => setSeeMore(prev => !prev)}>
                      <View>
                        <Text
                          variant="bodyMedium"
                          style={{color: '#dedede', marginTop: 6}}>
                          {seeMore
                            ? item.user.description
                            : item.user.description.substring(0, 50)}
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

                  {/* SIDEBAR */}
                  <View
                    style={{
                      width: 60,
                      height: '100%',
                      paddingBottom: 59,
                      justifyContent: 'flex-end',
                    }}>
                    <View style={{marginTop: 9, alignItems: 'center'}}>
                      <Avatar.Image
                        size={48}
                        style={{
                          marginBottom: 13,
                          borderColor: 'white',
                          borderWidth: 2,
                        }}
                        source={{
                          uri: 'https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg ',
                        }}
                      />
                    </View>

                    <View style={{marginTop: 9, alignItems: 'center'}}>
                      <Avatar.Image
                        size={48}
                        style={{
                          marginBottom: 13,
                          borderColor: 'white',
                          borderWidth: 2,
                        }}
                        source={{
                          uri: 'https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg ',
                        }}
                      />
                      <Text style={{color: 'white', fontSize: 12}}>
                        {item.count.like}
                      </Text>
                    </View>

                    <View style={{marginTop: 9, alignItems: 'center'}}>
                      <Avatar.Image
                        size={48}
                        style={{
                          marginBottom: 13,
                          borderColor: 'white',
                          borderWidth: 2,
                        }}
                        source={{
                          uri: 'https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg ',
                        }}
                      />
                      <Text style={{color: 'white', fontSize: 12}}>
                        {item.count.comment}
                      </Text>
                    </View>

                    <View style={{marginTop: 9, alignItems: 'center'}}>
                      <Avatar.Image
                        size={48}
                        style={{
                          marginBottom: 13,
                          borderColor: 'white',
                          borderWidth: 2,
                        }}
                        source={{
                          uri: 'https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg ',
                        }}
                      />
                      <Text style={{color: 'white', fontSize: 12}}>
                        {item.count.share}
                      </Text>
                    </View>

                    <View style={{marginTop: 9, alignItems: 'center'}}>
                      <Avatar.Image
                        size={48}
                        style={{
                          marginBottom: 13,
                          borderColor: 'white',
                          borderWidth: 2,
                        }}
                        source={{
                          uri: 'https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg ',
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <Chip
                    icon="information"
                    onPress={() => console.log('Pressed')}>
                    Example Chip
                  </Chip>
                </View>

                {/* <SegmentedButtons
                  value={segmentedButton}
                  onValueChange={setSegmentedButton}
                  buttons={[
                    {
                      value: 'type',
                      label: 'Block',
                    },
                    {
                      value: 'link',
                      label: 'NBA Top Shot',
                    },
                    {value: 'upload', label: 'Compete'},
                  ]}
                /> */}
              </SafeAreaView>
            </LinearGradient>
          </View>
        );
      })}
    </PagerView>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

export default Home;
