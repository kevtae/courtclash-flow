// SETUP
import React, {useState} from 'react';

// UI
import {StyleSheet, Dimensions} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Video from 'react-native-video';

const CarouselSubmissions = ({}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const width = Dimensions.get('window').width;

  return (
    <Carousel
      loop
      width={width * 0.6}
      height={width * 1.3}
      data={[...new Array(6).keys()]}
      scrollAnimationDuration={1000}
      onSnapToItem={index => setCurrentIndex(index)}
      style={styles.carousel}
      modeConfig={{parallaxScrollingOffset: 20}}
      mode="parallax"
      renderItem={({index}) => {
        return (
          <Video
            source={{
              uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            }}
            style={styles.video}
            poster={
              'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'
            }
            rate={1.0}
            volume={1.0}
            muted={false}
            resizeMode="cover"
            paused={currentIndex != index}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  carousel: {
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default CarouselSubmissions;
