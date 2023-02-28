// SETUP
import React, {useRef, useState, useEffect} from 'react';

// UI
import {StyleSheet, View, SafeAreaView} from 'react-native';
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

// FUNCTIONS
import {getSubmissions, getChallenges} from '@functions/api/challenge';

const Home = ({navigation}) => {
  const {userDB} = React.useContext(UserContext);
  const bottomSheetSubmissionsRef = useRef(null);
  const [submissions, setSubmissions] = useState({});
  const [currentSubmissions, setCurrentSubmissions] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState();

  useEffect(() => {
    getChallenges().then(res => {
      console.log('challenges-----', res.data.data.data);
    });
    fetchSubmissions();
  }, []);

  const openSubmissions = () => bottomSheetSubmissionsRef.current.openSheet();

  const fetchSubmissions = async () => {
    const subs = {};
    for (let i = 0; i < CHALLENGES.length; i++) {
      const res = await getSubmissions(CHALLENGES[i].ID);
      let hasSubs = res.data.data.data;
      subs[CHALLENGES[i].ID] = hasSubs ? hasSubs : [];
    }
    setSubmissions(subs);
  };

  return (
    <BottomSheetModalProvider>
      <PagerView
        orientation="vertical"
        initialPage={0}
        style={styles.container}>
        {CHALLENGES.map((item, index) => {
          const {ID, videoLink} = item;
          return (
            <View key={index}>
              <Video
                source={{uri: videoLink}}
                style={{flex: 1}}
                rate={1.0}
                volume={0.0}
                muted={true}
                resizeMode="cover"
                repeat
              />
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
                  <Header {...{navigation}} user={userDB} />
                  <View style={styles.descriptionAndSubmissionContainer}>
                    <Description topshotItem={item} />
                    <SubmissionCard
                      submissions={submissions[ID]}
                      onPress={currentSubs => {
                        setCurrentSubmissions(currentSubs);
                        setCurrentChallenge(currentSubs[0]['ChallengeID']);
                      }}
                      {...{openSubmissions}}
                    />
                  </View>
                  <InfoChips topshotItem={item} />
                  <Images topshotItem={item} />
                </SafeAreaView>
              </LinearGradient>
            </View>
          );
        })}
      </PagerView>
      <BottomSheetSubmissions
        ref={bottomSheetSubmissionsRef}
        {...{navigation, currentSubmissions, currentChallenge}}
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

const CHALLENGES = [
  {
    ID: '63f91efb6322941ff43065c1',
    Image: [
      'https://assets.nbatopshot.com/resize/editions/4_throwdowns_rare/0bf84b7a-88f0-4376-ac0a-9ad2b1d25a33/play_0bf84b7a-88f0-4376-ac0a-9ad2b1d25a33_4_throwdowns_rare_capture_Game_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
      'https://assets.nbatopshot.com/resize/editions/4_throwdowns_rare/0bf84b7a-88f0-4376-ac0a-9ad2b1d25a33/play_0bf84b7a-88f0-4376-ac0a-9ad2b1d25a33_4_throwdowns_rare_capture_Category_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
      'https://assets.nbatopshot.com/resize/editions/4_throwdowns_rare/0bf84b7a-88f0-4376-ac0a-9ad2b1d25a33/play_0bf84b7a-88f0-4376-ac0a-9ad2b1d25a33_4_throwdowns_rare_capture_Hero_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
      'https://assets.nbatopshot.com/resize/editions/4_throwdowns_rare/0bf84b7a-88f0-4376-ac0a-9ad2b1d25a33/play_0bf84b7a-88f0-4376-ac0a-9ad2b1d25a33_4_throwdowns_rare_capture_ReverseHero_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
      'https://assets.nbatopshot.com/resize/editions/4_throwdowns_rare/0bf84b7a-88f0-4376-ac0a-9ad2b1d25a33/play_0bf84b7a-88f0-4376-ac0a-9ad2b1d25a33_4_throwdowns_rare_capture_Logos_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
    ],
    challengeType: 'Throwdowns',
    date: '2022-02-04T00:00:00-05:00',
    description:
      'Vision won’t get you far if you can’t get your man the rock. Dallas Mavericks guard Luka Doncic watches Kristaps Porzingis roll perfectly out of a screen, then reaches way out around his defender to fire a sidewinding bullet pass to the wide-open center in the paint on January 20, 2021. Doncic walked away with a cool 13-point, 12-rebound, 12-assist triple double in the win.',
    ended: false,
    link: 'https://nbatopshot.com/listings/p2p/3e9f35e2-a880-4de0-9dd4-25dd30c3edad+0bf84b7a-88f0-4376-ac0a-9ad2b1d25a33',
    name: 'LUKA DONČIĆ',
    videoLink: 'https://assets.nbatopshot.com/media/35360250/video.mp4',
  },
  {
    ID: '63f91fac6322941ff43065c2',
    Image: [
      'https://assets.nbatopshot.com/resize/editions/2_and_then_there_were_four_rare/c9c0de2a-176e-4e0b-adda-1b8ca49f6295/play_c9c0de2a-176e-4e0b-adda-1b8ca49f6295_2_and_then_there_were_four_rare_capture_Game_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
      'https://assets.nbatopshot.com/resize/editions/2_and_then_there_were_four_rare/c9c0de2a-176e-4e0b-adda-1b8ca49f6295/play_c9c0de2a-176e-4e0b-adda-1b8ca49f6295_2_and_then_there_were_four_rare_capture_Category_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
      'https://assets.nbatopshot.com/resize/editions/2_and_then_there_were_four_rare/c9c0de2a-176e-4e0b-adda-1b8ca49f6295/play_c9c0de2a-176e-4e0b-adda-1b8ca49f6295_2_and_then_there_were_four_rare_capture_Hero_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
      'https://assets.nbatopshot.com/resize/editions/2_and_then_there_were_four_rare/c9c0de2a-176e-4e0b-adda-1b8ca49f6295/play_c9c0de2a-176e-4e0b-adda-1b8ca49f6295_2_and_then_there_were_four_rare_capture_ReverseHero_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
      'https://assets.nbatopshot.com/resize/editions/2_and_then_there_were_four_rare/c9c0de2a-176e-4e0b-adda-1b8ca49f6295/play_c9c0de2a-176e-4e0b-adda-1b8ca49f6295_2_and_then_there_were_four_rare_capture_Logos_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
    ],
    challengeType: 'Layup',
    date: '2021-06-25T01:00:00-04:00',
    description:
      'Giannis Antetokounmpo continues to add new layers to his already-unprecedented repertoire. Eager to send a message in Game 2 of the Eastern Conference Finals, the Milwaukee Bucks forward spins hard into the paint, takes off for what initially looks like a thundering one-handed slam, but calmly adjusts the attempt into a graceful layup to avoid Atlanta Hawks defender Clint Capela. Antetokounmpo finished with 25 points in just 29 in the June 25, 2021 victory.',
    ended: false,
    link: 'https://nbatopshot.com/listings/p2p/7605f9c5-c9cb-47f4-8e8f-0c2751bee194+c9c0de2a-176e-4e0b-adda-1b8ca49f6295',
    name: 'GIANNIS ANTETOKOUNMPO',
    videoLink:
      'https://assets.nbatopshot.com/editions/2_and_then_there_were_four_rare/c9c0de2a-176e-4e0b-adda-1b8ca49f6295/play_c9c0de2a-176e-4e0b-adda-1b8ca49f6295_2_and_then_there_were_four_rare_capture_Animated_1080_1920_Black.mp4',
  },
  {
    ID: '63fdcc3338f2ac4579c32825',
    Image: [
      'https://assets.nbatopshot.com/resize/editions/4_throwdowns_rare/85ee28e0-b12c-4291-9e22-b607b2d63df8/play_85ee28e0-b12c-4291-9e22-b607b2d63df8_4_throwdowns_rare_capture_Game_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
      'https://assets.nbatopshot.com/resize/editions/4_throwdowns_rare/85ee28e0-b12c-4291-9e22-b607b2d63df8/play_85ee28e0-b12c-4291-9e22-b607b2d63df8_4_throwdowns_rare_capture_Category_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
      'https://assets.nbatopshot.com/resize/editions/4_throwdowns_rare/85ee28e0-b12c-4291-9e22-b607b2d63df8/play_85ee28e0-b12c-4291-9e22-b607b2d63df8_4_throwdowns_rare_capture_Hero_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
      'https://assets.nbatopshot.com/resize/editions/4_throwdowns_rare/85ee28e0-b12c-4291-9e22-b607b2d63df8/play_85ee28e0-b12c-4291-9e22-b607b2d63df8_4_throwdowns_rare_capture_ReverseHero_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
      'https://assets.nbatopshot.com/resize/editions/4_throwdowns_rare/85ee28e0-b12c-4291-9e22-b607b2d63df8/play_85ee28e0-b12c-4291-9e22-b607b2d63df8_4_throwdowns_rare_capture_Logos_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
    ],
    challengeType: 'Dribble',
    date: '2023-02-27T19:00:00-05:00',
    description:
      "Sit and Dribble challenge. In this challenge, the player must sit on the ground with their legs crossed and dribble the basketball continuously for a set amount of time. The challenge could be made more difficult by adding different variations such as changing the dribbling hand, incorporating crossovers, or increasing the dribbling speed. This challenge can help improve a player's ball handling skills and overall control of the basketball while also working on their core strength and stability.",
    ended: false,
    link: 'https://nbatopshot.com/listings/p2p/3e9f35e2-a880-4de0-9dd4-25dd30c3edad+85ee28e0-b12c-4291-9e22-b607b2d63df8',
    name: 'Dribble Master',
    videoLink:
      'https://firebasestorage.googleapis.com/v0/b/myjerry-dev.appspot.com/o/claims%2FTikPost_3.mp4?alt=media&token=ab7da936-6d5f-4084-984f-57281c29563a',
  },
  {
    ID: '63f920ba62ba21375ca5e451',
    Image: [
      'https://assets.nbatopshot.com/resize/editions/4_throwdowns_rare/85ee28e0-b12c-4291-9e22-b607b2d63df8/play_85ee28e0-b12c-4291-9e22-b607b2d63df8_4_throwdowns_rare_capture_Game_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
      'https://assets.nbatopshot.com/resize/editions/4_throwdowns_rare/85ee28e0-b12c-4291-9e22-b607b2d63df8/play_85ee28e0-b12c-4291-9e22-b607b2d63df8_4_throwdowns_rare_capture_Category_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
      'https://assets.nbatopshot.com/resize/editions/4_throwdowns_rare/85ee28e0-b12c-4291-9e22-b607b2d63df8/play_85ee28e0-b12c-4291-9e22-b607b2d63df8_4_throwdowns_rare_capture_Hero_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
      'https://assets.nbatopshot.com/resize/editions/4_throwdowns_rare/85ee28e0-b12c-4291-9e22-b607b2d63df8/play_85ee28e0-b12c-4291-9e22-b607b2d63df8_4_throwdowns_rare_capture_ReverseHero_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
      'https://assets.nbatopshot.com/resize/editions/4_throwdowns_rare/85ee28e0-b12c-4291-9e22-b607b2d63df8/play_85ee28e0-b12c-4291-9e22-b607b2d63df8_4_throwdowns_rare_capture_Logos_2880_2880_Black.jpg?format=webp&quality=80&width=1451&cv=1',
    ],
    challengeType: 'Dunk',
    date: '2022-01-09T00:00:00-05:00',
    description:
      'LeBron James can turn nothing into something with the flip of a switch. With a full head of steam, James makes a quick cross around one defender, then ducks into the paint and reaches back for an incredible, one-handed power dunk over Jaren Jackson Jr. The Los Angeles Lakers superstar was fully locked in with a game-high 35 points, nine rebounds and seven assists in a January 9, 2022 matchup against the Memphis Grizzlies.',
    ended: false,
    link: 'https://nbatopshot.com/listings/p2p/3e9f35e2-a880-4de0-9dd4-25dd30c3edad+85ee28e0-b12c-4291-9e22-b607b2d63df8',
    name: 'LEBRON JAMES',
    videoLink: 'https://assets.nbatopshot.com/media/35356523/video.mp4',
  },
];
