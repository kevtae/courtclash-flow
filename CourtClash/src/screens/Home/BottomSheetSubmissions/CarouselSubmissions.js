// SETUP
import React, {useState} from 'react';

// UI
import {StyleSheet, Dimensions} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';

const CarouselSubmissions = ({currentSubmissions, setCurrentVideo}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const width = Dimensions.get('window').width;

  return (
    <Carousel
      loop
      width={width * 0.6}
      height={width * 1.3}
      data={currentSubmissions}
      scrollAnimationDuration={1000}
      onSnapToItem={index => {
        setCurrentIndex(index);
        setCurrentVideo(currentSubmissions[index]);
      }}
      style={styles.carousel}
      modeConfig={{parallaxScrollingOffset: 20}}
      mode="parallax"
      renderItem={({index}) => {
        let isPlay = currentIndex == index;
        let hasSubs = currentSubmissions.length !== 0;
        return isPlay ? (
          <Video
            source={{
              uri: hasSubs && currentSubmissions[index].videoLink,
            }}
            style={styles.video}
            rate={1.0}
            volume={1.0}
            muted={false}
            resizeMode="cover"
            paused={currentIndex != index}
          />
        ) : (
          <LinearGradient
            colors={['#f7f4d2', '#f7eb7c', '#f7f4d2']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.video}
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
    borderWidth: 0.5,
    borderColor: '#f7f4d2',
  },
});

export default CarouselSubmissions;
