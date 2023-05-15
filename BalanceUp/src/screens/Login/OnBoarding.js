import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSetRecoilState} from 'recoil';
import FastImage from 'react-native-fast-image';
import {getRefreshToken} from '../../actions/memberJoinApi';
import {jwtState, jwtRefreshState} from '../../recoil/atom';
import {TextData} from '../../resource/data/OnBoardingText';

import jwt_decode from 'jwt-decode';
import KeyumTypo from '../../resource/image/KeyumLOGOTYPO.png';
import NextBtn from '../../resource/image/Onboarding/NextBtn.svg';
import PrevBtn from '../../resource/image/Onboarding/PrevBtn.svg';

export default function OnBoarding({navigation}) {
  const setJwt = useSetRecoilState(jwtState);
  const setJwtRefresh = useSetRecoilState(jwtRefreshState);

  const getData = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        const data = JSON.parse(value);
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkJwt = async () => {
      try {
        const dataToken = await getData('jwt');
        const dataRefreshToken = await getData('jwtRefresh');

        if (dataToken !== null) {
          const decodedUserName = jwt_decode(dataToken);
          let res;
          await getRefreshToken(
            decodedUserName.username,
            dataToken,
            dataRefreshToken,
          ).then(response => {
            res = response;
            if (res.resultCode === 'success') {
              setJwt(res.body.token);
              setJwtRefresh(res.body.refreshToken);

              AsyncStorage.setItem('jwt', JSON.stringify(res.body.token));
              AsyncStorage.setItem(
                'jwtRefresh',
                JSON.stringify(res.body.refreshToken),
              );
              navigation.push('Main');
            }
          });
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    checkJwt();
  }, []);

  const [btnDisabled, setBtnDisabled] = useState(true);

  const handleChange = index => {
    index === 2 ? setBtnDisabled(false) : setBtnDisabled(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.typoView}>
        <Image source={KeyumTypo} style={styles.typoStyle} />
      </View>
      <Swiper
        dot={<View style={styles.dotStyle} />}
        activeDot={<View style={styles.activeDotStyle} />}
        loop={false}
        removeClippedSubviews={false}
        onIndexChanged={handleChange}
        nextButton={<NextBtn style={styles.svgStyle} />}
        prevButton={<PrevBtn style={styles.svgStyle} />}
        showsButtons={true}>
        {TextData.map(data => (
          <View style={styles.slide} key={data.id}>
            <FastImage style={styles.onBoardingIMG} source={data.img} />
            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.subTitle}>{data.text1}</Text>
            <Text style={styles.subTitle}>{data.text2}</Text>
          </View>
        ))}
      </Swiper>
      <TouchableOpacity
        style={[
          styles.btnStart,
          {backgroundColor: btnDisabled ? '#CED6FF' : '#585FFF'},
        ]}
        onPress={() => navigation.navigate('Login')}
        disabled={btnDisabled}
        activeOpacity={1.0}>
        <Text style={styles.btnText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    alignItems: 'center',
  },
  typoView: {
    alignItems: 'center',
    marginTop: responsiveHeight(13),
    marginBottom: responsiveHeight(3),
  },
  typoStyle: {
    width: responsiveWidth(58),
    height: responsiveHeight(5),
    marginLeft: 4,
  },
  onBoardingIMG: {
    width: responsiveWidth(58),
    height: responsiveHeight(36),
    marginLeft: 10,
    marginBottom: responsiveHeight(3),
  },
  title: {
    color: '#232323',
    textAlign: 'center',
    fontFamily: 'Pretendard-Bold',
    marginTop: responsiveHeight(10),
    marginBottom: responsiveHeight(0.8),
    fontSize: responsiveFontSize(2.75),
  },
  subTitle: {
    fontSize: responsiveFontSize(1.75),
    fontFamily: 'Pretendard-Medium',
    color: '#888888',
    marginTop: 3,
  },
  btnStart: {
    fontWeight: 'bold',
    padding: 15,
  },
  btnText: {
    textAlign: 'center',
    color: '#ffffff',
    fontFamily: 'Pretendard-Medium',
    fontSize: responsiveFontSize(1.98),
  },
  dotStyle: {
    backgroundColor: '#888888',
    width: 10,
    height: 10,
    borderRadius: 10,
    marginLeft: 4,
    marginRight: 4,
    marginBottom: responsiveHeight(24),
  },
  activeDotStyle: {
    backgroundColor: '#232323',
    width: 25,
    height: 10,
    borderRadius: 10,
    marginLeft: 4,
    marginRight: 4,
    marginBottom: responsiveHeight(24),
  },
  svgStyle: {
    marginBottom: responsiveHeight(33),
  },
});
