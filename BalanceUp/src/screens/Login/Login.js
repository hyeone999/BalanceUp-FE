import React, {useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {loginWithKakaoAccount} from '@react-native-seoul/kakao-login';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import auth from '@react-native-firebase/auth';
import {
  loginKakao,
  SignInKakao,
  loginGoogle,
} from '../../actions/memberJoinApi';
import {useSetRecoilState} from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  userNameState,
  jwtState,
  jwtRefreshState,
  userLogin,
} from '../../recoil/atom';
import FastImage from 'react-native-fast-image';
import Login_Onboading from '../../resource/image/Login/login_onborading.png';
import KakaoSvg from '../../resource/image/Login/Kakao.svg';
import GoogleSvg from '../../resource/image/Login/Google.svg';
import {deleteExpiredRoutine} from '../../actions/routineAPI';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const googleSigninConfigure = () => {
  GoogleSignin.configure({
    webClientId:
      '702679288927-s3riqhj1pv7uvc4vlnhp5o8823mqjpkh.apps.googleusercontent.com',
  });
};

// const androidKeys = {
//   kConsumerKey: 'emLJacIpqC1VGarFjLHx',
//   kConsumerSecret: 'z_Q_8LbpiI',
//   kServiceAppName: 'keyum',
// }; // 추후에 process.env로 빼기

export default function Login({navigation: {navigate}}) {
  useEffect(() => {
    googleSigninConfigure();
  });

  const setUserName = useSetRecoilState(userNameState);
  const setjwt = useSetRecoilState(jwtState);
  const setKorG = useSetRecoilState(userLogin);
  const setJwtRefresh = useSetRecoilState(jwtRefreshState);

  const signInWithKakao = async () => {
    const token = await loginWithKakaoAccount();

    let res;
    await loginKakao(token.accessToken).then(response => {
      res = response;
      console.log(response);
      if (res.body.login === 'sign-up') {
        setUserName(res.body.username);
        setKorG('K');
        navigate('NickName');
      } else if (res.body.login === 'sign-in') {
        AsyncStorage.setItem('username', res.body.username);
        signInKakao(res.body.username);
      }
    });
  };

  const signInKakao = async userName => {
    let res;
    await SignInKakao(userName).then(response => {
      res = response;
      if (res.resultCode === 'success') {
        setjwt(res.body.token);
        setJwtRefresh(res.body.refreshToken);
        // jwt 로컬 스토리지 저장후 메인화면 보내기
        AsyncStorage.setItem('jwt', JSON.stringify(res.body.token));
        AsyncStorage.setItem(
          'jwtRefresh',
          JSON.stringify(res.body.refreshToken),
        );
        deleteExpiredRoutine();
        navigate('Main');
      }
    });
  };

  const signInGoogle = async userName => {
    let res;
    await SignInKakao(userName).then(response => {
      res = response;
      if (res.resultCode === 'success') {
        setjwt(res.body.token);
        setJwtRefresh(res.body.refreshToken);
        // jwt 로컬 스토리지 저장후 메인화면 보내기
        AsyncStorage.setItem('jwt', JSON.stringify(res.body.token));
        AsyncStorage.setItem(
          'jwtRefresh',
          JSON.stringify(res.body.refreshToken),
        );
        deleteExpiredRoutine();
        navigate('Main');
      }
    });
  };

  const onGoogleButtonPress = async () => {
    // const {idToken} = await GoogleSignin.signIn();
    const code = await GoogleSignin.getTokens();
    // const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    console.log(code);

    const token = code;
    await loginGoogle(token.accessToken).then(response => {
      let res = response;
      if (res.body.login === 'sign-up') {
        setUserName(res.body.username);
        setKorG('G');
        navigate('NickName');
      } else if (res.body.login === 'sign-in') {
        AsyncStorage.setItem('username', res.body.username);
        signInGoogle(res.body.username);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imgView}>
        <FastImage style={styles.loginImg} source={Login_Onboading} />
      </View>
      <Text style={styles.title}>만나서 반가워요!</Text>
      <Text style={styles.subTitle}>로그인 할 계정을 선택해 주세요</Text>
      <TouchableOpacity
        activeOpacity={1.0}
        onPress={signInWithKakao}
        style={styles.btnKakao}>
        <KakaoSvg />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1.0}
        style={styles.btnGoogle}
        onPress={onGoogleButtonPress}>
        <GoogleSvg />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  loginImg: {
    width: responsiveWidth(83),
    height: responsiveHeight(48),
  },
  title: {
    color: '#232323',
    fontSize: responsiveFontSize(2.75),
    fontFamily: 'Pretendard-Bold',
  },
  subTitle: {
    fontFamily: 'Pretendard-Medium',
    color: '#888888',
    marginTop: responsiveHeight(0.8),
    fontSize: responsiveFontSize(1.75),
  },
  imgView: {
    marginTop: responsiveHeight(10),
    marginBottom: responsiveHeight(5),
  },
  btnKakao: {
    marginTop: responsiveHeight(4.5),
  },
  btnGoogle: {
    marginTop: responsiveHeight(2),
  },
});
