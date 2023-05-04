import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  nickNameState,
  userNameState,
  jwtState,
  jwtRefreshState,
  userLogin,
} from '../../recoil/atom';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {joinKakao, joinGoogle} from '../../actions/memberJoinApi';

import CheckOn from '../../resource/image/Agree/check_on.svg';
import CheckOff from '../../resource/image/Agree/check_off.svg';
import MoreInfoArrow from '../../resource/image/Agree/moreInfoArrow.svg';
import {FlatList} from 'react-native-gesture-handler';

const AgreeScreen = ({navigation: {navigate}}) => {
  const [disabled, setDisabled] = useState(false);
  const [allCheck, setAllCheck] = useState(false);
  const [serviceCheck, setServiceCheck] = useState(false);
  const [useCheck, setUseCheck] = useState(false);
  const [ageCheck, setAgeCheck] = useState(false);
  const nickName = useRecoilValue(nickNameState);
  const userMail = useRecoilValue(userNameState);
  const setjwt = useSetRecoilState(jwtState);
  const KorG = useRecoilValue(userLogin);
  const setJwtRefresh = useSetRecoilState(jwtRefreshState);

  const textData = [
    {
      id: 1,
      title: '[필수] 서비스 이용약관에 동의합니다.',
      check: serviceCheck,
      onPress: () => setServiceCheck(prev => !prev),
      link: () =>
        Linking.openURL(
          'https://keyum.notion.site/KEYUM-dd9853b3ffa74f34951a57cfb7d195ce',
        ),
    },
    {
      id: 2,
      title: '[필수] 개인정보 수집 / 이용에 동의합니다.',
      check: useCheck,
      onPress: () => setUseCheck(prev => !prev),
      link: () =>
        Linking.openURL(
          'https://keyum.notion.site/KEYUM-ef4e1a7f198d4cec8d4642c3bf7cc0a4',
        ),
    },
    {
      id: 3,
      title: '[필수] 만 14세 이상입니다.',
      check: ageCheck,
      onPress: () => setAgeCheck(prev => !prev),
    },
  ];

  const allBtnEvent = () => {
    allCheck === false
      ? (setAllCheck(true),
        setServiceCheck(true),
        setUseCheck(true),
        setAgeCheck(true))
      : (setAllCheck(false),
        setServiceCheck(false),
        setUseCheck(false),
        setAgeCheck(false));
  };

  useEffect(() => {
    serviceCheck === true && useCheck === true && ageCheck === true
      ? setAllCheck(true)
      : setAllCheck(false);
    setDisabled(!allCheck);
  }, [useCheck, serviceCheck, ageCheck, allCheck]);

  const handleJoin = async () => {
    let res;
    if (KorG === 'K') {
      await joinKakao(userMail, nickName).then(response => {
        res = response;
        if (res.resultCode === 'success') {
          // jwt 로컬 스토리지 저장후 메인화면 보내기
          setjwt(res.body.token);
          setJwtRefresh(res.body.refreshToken);
          AsyncStorage.setItem('nickName', nickName);
          AsyncStorage.setItem('jwt', JSON.stringify(res.body.token));
          AsyncStorage.setItem(
            'jwtRefresh',
            JSON.stringify(res.body.refreshToken),
          );
          navigate('Main');
        }
      });
    } else {
      await joinGoogle(userMail, nickName).then(response => {
        res = response;
        if (res.resultCode === 'success') {
          // jwt 로컬 스토리지 저장후 메인화면 보내기
          setjwt(res.body.token);
          setJwtRefresh(res.body.refreshToken);
          AsyncStorage.setItem('nickName', nickName);
          AsyncStorage.setItem('jwt', JSON.stringify(res.body.token));
          AsyncStorage.setItem(
            'jwtRefresh',
            JSON.stringify(res.body.refreshToken),
          );
          navigate('Main');
        }
      });
    }
  };

  const CheckItem = ({id, title, onPress, link, check}) => (
    <View style={styles.btnWrap}>
      {check ? (
        <CheckOn
          width={22}
          height={22}
          style={styles.checkBox}
          onPress={onPress}
        />
      ) : (
        <CheckOff
          width={22}
          height={22}
          style={styles.checkBox}
          onPress={onPress}
        />
      )}
      <Text style={styles.agreeText}>{title}</Text>
      {id === 3 ? null : (
        <MoreInfoArrow
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          onPress={link}
          style={styles.arrowBtnStyle}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Progress.Bar
        progress={0.5}
        width={responsiveWidth(90)}
        height={6}
        unfilledColor={'#CED6FF'}
        borderWidth={0}
        color={'#585FFF'}
        style={styles.barWrap}
      />
      <View style={styles.sheet}>
        <Text style={styles.title}>약관 동의</Text>
        <View style={styles.allBtnWrap}>
          {allCheck ? (
            <CheckOn style={styles.allCheckBox} onPress={allBtnEvent} />
          ) : (
            <CheckOff style={styles.allCheckBox} onPress={allBtnEvent} />
          )}
          <Text style={styles.allAgreeText}>모두 동의합니다</Text>
        </View>
        <View style={styles.boderLine} />
        <FlatList
          data={textData}
          renderItem={({item}) => (
            <CheckItem
              id={item.id}
              title={item.title}
              onPress={item.onPress}
              link={item.link}
              check={item.check}
            />
          )}
          keyExtractor={item => item.id}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.nextButton,
          {backgroundColor: disabled ? '#CED6FF' : '#585FFF'},
        ]}
        onPress={handleJoin}
        activeOpacity={1.0}
        disabled={disabled}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Pretendard-Bold',
    color: '#232323',
    marginTop: 40,
    marginBottom: 30,
  },
  allAgreeText: {
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: '#232323',
  },
  agreeText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Light',
    color: '#232323',
  },
  sheet: {
    flex: 1,
    marginLeft: 20,
  },
  btnWrap: {
    flexDirection: 'row',
    marginTop: 18,
  },
  allBtnWrap: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  nextButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(100),
    height: 58,
  },
  nextButtonText: {
    fontSize: responsiveFontSize(1.98),
    fontFamily: 'Pretendard-Medium',
    color: '#ffffff',
  },
  barWrap: {
    marginLeft: 20,
    marginTop: 70,
    marginBottom: 10,
    transform: [{rotate: '180deg'}],
  },
  boderLine: {
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb',
    width: 450,
    right: 20,
  },
  allCheckBox: {
    marginRight: 10,
  },
  checkBox: {
    marginRight: 10,
  },
  arrowBtnStyle: {
    alignSelf: 'center',
    position: 'absolute',
    right: responsiveWidth(5),
  },
});

export default AgreeScreen;
