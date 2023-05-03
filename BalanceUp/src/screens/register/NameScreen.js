import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import * as Progress from 'react-native-progress';
import {nickNameState} from '../../recoil/atom';
import {useRecoilState} from 'recoil';
import FastImage from 'react-native-fast-image';
import {validateText} from '../../utils/regex';
import {duplicationCheckAPI} from '../../actions/checkNameAPI';
import NameOnboarding from '../../resource/image/Name/NameOnboarding.png';
import ErrorSvg from '../../resource/image/Name/name_error.svg';

const NameScreen = ({navigation: {navigate}}) => {
  const [checkTextError, setCheckTextError] = useState('');
  const [checkTextPass, setCheckTextPass] = useState('');
  const [checkDisabled, setCheckDisabled] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [nickName, setNickName] = useRecoilState(nickNameState);

  useEffect(() => {
    setDisabled(!checkTextPass); // pass = disabled(false)
    setCheckDisabled(!(nickName && !checkTextError)); // 닉네임 규칙이 맞지 않으면 중복확인 버튼 disabled
  }, [checkTextPass, nickName, checkTextError]);

  const handleTextChange = nickName => {
    setNickName(nickName);
    setCheckTextError(
      validateText(nickName)
        ? ''
        : '닉네임에 특수문자 및 공백을 포함할 수 없어요',
    );

    // 중복확인 성공 후 유저가 닉네임을 선택하지 않고,
    // 닉네임을 다시 입력해서 그 닉네임이 정규식을 위반할시 text 변경 + 중복확인 비활성화
    setCheckTextPass(validateText(nickName) ? '' : null);

    // 글자수 11자 제한
    if (nickName.length >= 11) {
      setCheckTextError('11글자 이상 입력 불가합니다');
    }
  };

  // 중복 확인 구현
  const duplicationCheck = () => {
    duplicationCheckAPI(nickName).then(response => {
      response === true
        ? setCheckTextPass('사용 가능한 닉네임이에요!')
        : setCheckTextError('이미 존재하는 닉네임이에요');
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
        <View style={styles.title}>
          <Text style={styles.titleText}>내 캐릭터의</Text>
          <Text style={styles.titleText}>닉네임을 입력해주세요</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <TextInput
              value={nickName}
              onChangeText={handleTextChange}
              style={[
                styles.textInput,
                {borderColor: checkTextError ? '#F05D5D' : '#AFAFAF'},
              ]}
              autoCapitalize="none"
              fontSize={15}
              placeholder="닉네임 입력"
              placeholderTextColor="#AFAFAF"
            />
            {checkTextError ? <ErrorSvg style={styles.errorImg} /> : null}
            <TouchableOpacity
              style={[
                styles.duplicationBtn,
                {borderColor: checkTextPass ? '#CED6FF' : '#585FFF'},
              ]}
              activeOpacity={1.0}
              onPress={duplicationCheck}
              disabled={checkDisabled}>
              <Text
                style={[
                  styles.duplicationText,
                  {color: checkTextPass ? '#CED6FF' : '#585FFF'},
                ]}>
                중복확인
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={[
              styles.inputText,
              {
                color:
                  !checkTextError && !checkTextPass
                    ? '#AFAFAF'
                    : checkTextError
                    ? '#F05D5D'
                    : '#00B528',
              },
            ]}>
            {!checkTextError && !checkTextPass
              ? '11자 내로 작성해 주세요 (공백, 특수문자 불가)'
              : checkTextError
              ? checkTextError
              : checkTextPass}
          </Text>
        </View>
        <View style={styles.gifView}>
          <FastImage style={styles.onboardingImg} source={NameOnboarding} />
        </View>
        <TouchableOpacity
          style={[
            styles.nextButton,
            {backgroundColor: disabled ? '#CED6FF' : '#585FFF'},
          ]}
          onPress={() => navigate('Agree')}
          activeOpacity={1.0}
          disabled={disabled}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  title: {
    marginTop: 40,
    marginLeft: 20,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 22,
    fontFamily: 'Pretendard-Bold',
    color: '#000',
  },
  form: {
    flex: 1,
    marginLeft: 20,
  },
  inputWrapper: {
    marginTop: 25,
    position: 'relative',
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textInput: {
    width: responsiveWidth(60),
    height: responsiveHeight(7.5),
    color: '#232323',
    borderWidth: 1,
    borderColor: '#AFAFAF',
    borderRadius: 5,
    paddingLeft: 20,
    fontFamily: 'Pretendard-Bold',
  },
  nextButton: {
    width: responsiveWidth(100),
    justifyContent: 'center',
    alignItems: 'center',
    height: 58,
    padding: 15,
  },
  nextButtonText: {
    fontSize: responsiveFontSize(1.98),
    fontFamily: 'Pretendard-Medium',
    color: '#fff',
  },
  barWrap: {
    marginLeft: 20,
    marginTop: 70,
    marginBottom: 10,
  },
  duplicationBtn: {
    width: responsiveWidth(26.5),
    height: responsiveHeight(7.5),
    borderWidth: 1,
    borderColor: '#585FFF',
    borderRadius: 5,
    marginLeft: 15,
  },
  duplicationText: {
    color: '#585FFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'center',
    fontSize: 16,
    marginTop: responsiveHeight(2),
  },
  gifView: {
    alignItems: 'center',
    width: '100%',
    marginBottom: responsiveHeight(6),
  },
  inputText: {
    marginTop: -13,
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
  },
  errorText: {
    color: '#F05D5D',
    marginTop: -13,
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
  },
  passText: {
    color: '#00B528',
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    marginTop: -17,
  },
  onboardingImg: {
    width: responsiveWidth(100),
    height: 269,
  },
  errorImg: {
    position: 'absolute',
    left: responsiveWidth(50),
    top: responsiveHeight(2.5),
  },
});

export default NameScreen;
