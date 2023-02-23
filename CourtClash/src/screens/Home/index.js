// SETUP
import React, {useRef, useState} from 'react';

// UI
import {StyleSheet, View, ImageBackground, SafeAreaView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PagerView from 'react-native-pager-view';
import Video from 'react-native-video';

// CONTEXT
import {UserContext} from '@contexts';

// COMPONENTS
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import Header from './Header';
import Description from './Description';
import SubmissionCard from './SubmissionCard';
import InfoChips from './InfoChips';
import Images from './Images';
import BottomSheetSubmissions from './BottomSheetSubmissions';

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
  //   navigation.navigate('Verify', {number: formattedNumber, confirmation});
  const bottomSheetSubmissionsRef = useRef(null);

  const openSubmissions = () => bottomSheetSubmissionsRef.current.openSheet();

  return (
    <BottomSheetModalProvider>
      <PagerView
        orientation="vertical"
        onPageSelected={e => setSelected(e.nativeEvent.position)}
        initialPage={0}
        style={styles.container}>
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
                  'rgba(240,70,7,0.6)',
                  'rgba(13,13,13,0)',
                  'rgba(13,13,13,0)',
                  'rgba(166,18,31,0.6)',
                ]}
                style={styles.linearGradient}>
                <SafeAreaView style={{flex: 1, marginHorizontal: 20}}>
                  <Header />
                  <View style={styles.descriptionAndSubmissionContainer}>
                    <Description topshotItem={item} />
                    <SubmissionCard {...{openSubmissions}} />
                  </View>
                  <InfoChips />
                  <Images />
                </SafeAreaView>
              </LinearGradient>
            </View>
          );
        })}
      </PagerView>
      <BottomSheetSubmissions
        ref={bottomSheetSubmissionsRef}
        {...{navigation}}
      />
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    height: '100%',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1,
  },
  descriptionAndSubmissionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});

export default Home;
