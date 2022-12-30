import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Image,
} from 'react-native';
import {
  KakaoOAuthToken,
  getProfile as getKakaoProfile,
  logout,
  unlink,
  loginWithKakaoAccount,
} from '@react-native-seoul/kakao-login';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import FastImage from 'react-native-fast-image';
import auth from '@react-native-firebase/auth';
import {loginKakao} from '../../actions/memberJoinApi';
import {userNameState} from '../../recoil/atom';
import {useRecoilState} from 'recoil';
import {WithLocalSvg} from 'react-native-svg';
import Login_Onboading from '../../resource/image/login_onborading.png';
import KakaoSvg from '../../resource/image/Kakao.svg';
import GoogleSvg from '../../resource/image/Google.svg';

// const naverLogin = async (): Promise<void> => {
//   console.log('dd');
//   const token: NaverLoginResponse = await NaverLogin.login(info);
//   console.log(token);
// };
const googleSigninConfigure = () => {
  GoogleSignin.configure({
    webClientId:
      '702679288927-s3riqhj1pv7uvc4vlnhp5o8823mqjpkh.apps.googleusercontent.com',
  });
};

const signOutWithKakao = async (): Promise<void> => {
  const message = await logout();

  // setResult(message);
};

//   const getKakaoProfile = async (): Promise<void> => {
//     const profile: KakaoProfile = await getProfile();

//     setResult(JSON.stringify(profile));
//   };

const unlinkKakao = async (): Promise<void> => {
  const message = await unlink();

  // setResult(message);
};

const androidKeys = {
  kConsumerKey: 'emLJacIpqC1VGarFjLHx',
  kConsumerSecret: 'z_Q_8LbpiI',
  kServiceAppName: 'keyum',
}; // 추후에 process.env로 빼기

export default function Login({navigation}) {
  React.useEffect(() => {
    googleSigninConfigure();
  });
  // const [login, setLoginState] = React.useState(0);
  const [userName, setUserName] = useRecoilState(userNameState);

  const signInWithKakao = async (): Promise<void> => {
    const token: KakaoOAuthToken = await loginWithKakaoAccount();

    console.log(token.accessToken);
    let res;
    await loginKakao(token.accessToken).then(response => {
      res = response;
      console.log(res.body);
      if (res.body.login === 'sign-up') {
        setUserName(res.body.username);
        navigation.push('NickName');
      } else if (res.body.login === 'sign-in') {
        navigation.push('Main');
      }
    });
  };

  const onGoogleButtonPress = async (): Promise<void> => {
    const {idToken} = await GoogleSignin.signIn();
    const code = await GoogleSignin.getTokens();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    console.log(code);

    return auth().signInWithCredential(googleCredential);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imgView}>
        <FastImage style={{width: 335, height: 335}} source={Login_Onboading} />
      </View>
      <Text style={styles.title}>만나서 반가워요!</Text>
      <Text style={styles.subTitle}>로그인 할 계정을 선택해 주세요</Text>

      <TouchableOpacity onPress={signInWithKakao} style={styles.btnKakao}>
        <WithLocalSvg width={335} height={48} asset={KakaoSvg} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnGoogle}
        onPress={() => onGoogleButtonPress()}>
        <WithLocalSvg width={335} height={48} asset={GoogleSvg} />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 40,
        }}>
        <Button
          title="닉네임 설정 (임시 구현)"
          onPress={() => navigation.push('NickName')}
        />
        <Button
          title="홈 화면으로 가기 (임시 구현)"
          onPress={() => navigation.push('Main')}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
  },
  title: {
    width: '100%',
    color: '#232323',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subTitle: {
    width: '100%',
    color: '#888888',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 14,
  },
  imgView: {
    marginTop: 60,
    marginBottom: 30,
  },
  btnKakao: {
    marginTop: 35,
    width: 335,
    height: 48,
  },
  btnGoogle: {
    marginTop: 10,
    width: 335,
    height: 48,
  },
  btnText: {
    color: '#000',
    fontSize: 15,
    textAlign: 'center',
  },
});
