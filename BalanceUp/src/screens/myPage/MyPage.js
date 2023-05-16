import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  StyleSheet,
  Keyboard,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useRecoilState} from 'recoil';
import {validateText} from '../../utils/regex';
import {ChangeNameAPI, duplicationCheckAPI} from '../../actions/checkNameAPI';
import {nickNameState, show} from '../../recoil/atom';

import MoreInfoArrow from '../../resource/image/Agree/moreInfoArrow.svg';
import modalInnerStyles from '../../css/modalStyles';
import ErrorSvg from '../../resource/image/Name/name_error.svg';
import NewNotice from '../../resource/image/Common/noti_new.svg';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {sheetData, sheetData_} from '../../resource/data/MyPageText';

const MyPage = ({navigation: {navigate}}) => {
  const [userName, setUserName] = useState();
  const [nickName, setNickName] = useRecoilState(nickNameState);
  const [showIcon, setShowIcon] = useRecoilState(show);
  const [checkTextError, setCheckTextError] = useState('');
  const [checkTextPass, setCheckTextPass] = useState('');
  const [checkDisabled, setCheckDisabled] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // 모달 기능 구현
  const screenHeight = Dimensions.get('screen').height;

  const panY = useRef(new Animated.Value(screenHeight)).current;

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 10,
    useNativeDriver: true,
  });

  useEffect(() => {
    if (isModalVisible) {
      resetBottomSheet.start();
    }
    if (logoutModalVisible) {
      resetBottomSheet.start();
    }
  }, [isModalVisible, logoutModalVisible]);

  // Text Input 기능
  useEffect(() => {
    setDisabled(!checkTextPass); // pass = disabled(false)
    setCheckDisabled(!(userName && !checkTextError)); // 닉네임 규칙이 맞지 않으면 중복확인 버튼 disabled
  }, [checkTextPass, userName, checkTextError]);

  const handleTextChange = userName => {
    setUserName(userName);
    setCheckTextError(
      validateText(userName)
        ? ''
        : '닉네임에 특수문자 및 공백을 포함할 수 없어요',
    );

    // 중복확인 성공 후 유저가 닉네임을 선택하지 않고,
    // 닉네임을 다시 입력해서 그 닉네임이 정규식을 위반할시 text 변경 + 중복확인 비활성화
    setCheckTextPass(validateText(userName) ? '' : null);

    // 글자수 11자 제한
    if (userName.length >= 11) {
      setCheckTextError('11글자 이상 입력 불가합니다');
    }
  };

  // 중복 확인 구현
  const duplicationCheck = () => {
    duplicationCheckAPI(userName).then(response => {
      response === true
        ? setCheckTextPass('사용 가능한 닉네임이에요!')
        : setCheckTextError('이미 존재하는 닉네임이에요');
    });
  };

  // 닉네임 변경 구현
  const handleChangeName = () => {
    ChangeNameAPI(userName).then(
      setNickName(userName),
      console.log(nickName),
      setUserName(''),
      setCheckTextError(''),
      setCheckTextPass(''),
      setIsModalVisible(!isModalVisible),
    );
  };

  // 네이게이션 구현
  const goLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwt');
      await AsyncStorage.removeItem('jwtRefresh');

      setLogoutModalVisible(false);
      navigate('Login');
    } catch (error) {
      console.log(error);
    }
  };

  const onClick = (id, func) => {
    if (id === 1) {
      setIsModalVisible(!isModalVisible);
    } else if (id === 2) {
      navigate(func), setShowIcon(false);
    } else if (id === 3) {
      setLogoutModalVisible(!logoutModalVisible);
    }
  };

  const onClick_ = id => {
    if (id === 1) {
      Linking.openURL(
        'https://keyum.notion.site/KEYUM-dc7a7a7e475f402ea75025985a34061e',
      );
    } else if (id === 2) {
      Linking.openURL(
        'https://keyum.notion.site/KEYUM-dd9853b3ffa74f34951a57cfb7d195ce',
      );
    }
  };

  const handleCanel = () => {
    setUserName('');
    setCheckTextError('');
    setCheckTextPass('');
    setIsModalVisible(!isModalVisible);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.topSheet}>
            <Text style={styles.topTitle}>{nickName}님</Text>
            <TouchableOpacity
              onPress={() => navigate('Withdrawal')}
              activeOpacity={1.0}>
              <Text style={styles.withdrawalText}>회원 탈퇴</Text>
            </TouchableOpacity>
          </View>
          {sheetData.map(data => (
            <TouchableOpacity
              key={data.id}
              onPress={() => {
                onClick(data.id, data.func);
              }}
              activeOpacity={1.0}>
              <View style={styles.menuSheet}>
                <Text style={styles.menuText}>{data.title}</Text>
                {data.id === 2 && showIcon === true ? (
                  <NewNotice style={styles.newSvg} />
                ) : null}
                <MoreInfoArrow style={styles.arrowBtnStyle} />
              </View>
            </TouchableOpacity>
          ))}
          {sheetData_.map(data => (
            <TouchableOpacity
              key={data.id}
              onPress={() => {
                onClick_(data.id);
              }}
              activeOpacity={1.0}>
              <View
                style={[styles.menuSheet, {marginTop: data.id === 1 ? 15 : 2}]}>
                <Text style={styles.menuText}>{data.title}</Text>
                <MoreInfoArrow style={styles.arrowBtnStyle} />
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setLogoutModalVisible(!logoutModalVisible)}
            activeOpacity={0.5}>
            <View style={[styles.menuSheet]}>
              <Text style={styles.menuText}>로그아웃</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.verText}>Ver 1.0.0</Text>
        </View>

        {/* 닉네임 변경 모달 코드 */}
        <Modal
          visible={isModalVisible}
          animationType={'fade'}
          transparent={true}
          statusBarTranslucent={true}>
          <KeyboardAvoidingView
            style={styles.rootContainer}
            behavior={'padding'}>
            <Pressable
              style={modalInnerStyles.modalOverlay}
              onPress={handleCanel}>
              <TouchableWithoutFeedback>
                <Animated.View
                  style={{
                    ...modalInnerStyles.nameSheetContainer,
                  }}>
                  <Text style={modalInnerStyles.modalTitle}>
                    닉네임을 설정해 주세요
                  </Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      value={userName}
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
                    {checkTextError ? (
                      <ErrorSvg style={styles.errorImg} />
                    ) : null}
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
                  {!checkTextError && !checkTextPass ? (
                    <Text style={styles.inputText}>
                      11자 내로 작성해 주세요 (공백, 특수문자 불가)
                    </Text>
                  ) : (
                    <Text style={styles.errorText}>{checkTextError}</Text>
                  )}
                  {/* <Text style={styles.errorText}>{checkTextError}</Text> */}
                  <Text style={styles.passText}>{checkTextPass}</Text>
                  <View style={modalInnerStyles.modalFlex}>
                    <TouchableOpacity
                      disabled={disabled}
                      activeOpacity={1.0}
                      onPress={handleChangeName}
                      style={[
                        modalInnerStyles.saveBtn,
                        {backgroundColor: disabled ? '#CED6FF' : '#585FFF'},
                      ]}>
                      <Text style={modalInnerStyles.saveText}>저장</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>
            </Pressable>
          </KeyboardAvoidingView>
        </Modal>

        {/* 로그아웃 모달 구현 코드 */}
        <Modal
          visible={logoutModalVisible}
          animationType={'fade'}
          transparent={true}
          statusBarTranslucent={true}>
          <Pressable
            style={modalInnerStyles.modalOverlay}
            onPress={() => setLogoutModalVisible(!logoutModalVisible)}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={{
                  ...modalInnerStyles.bottomSheetContainer,
                }}>
                <Text style={modalInnerStyles.modalTitle}>로그아웃</Text>
                <Text style={modalInnerStyles.logoutModalText}>
                  로그아웃 하시겠습니까?
                </Text>
                <View style={modalInnerStyles.modalFlex}>
                  <TouchableOpacity
                    style={modalInnerStyles.noBtn}
                    activeOpacity={1.0}
                    onPress={() => setLogoutModalVisible(false)}>
                    <Text style={modalInnerStyles.noText}>아니요</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={goLogout}
                    activeOpacity={1.0}
                    style={modalInnerStyles.yesBtn}>
                    <Text style={modalInnerStyles.nextText}>네</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Pressable>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F9',
    flex: 1,
  },
  rootContainer: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  topSheet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topTitle: {
    fontSize: 22,
    fontFamily: 'Pretendard-Bold',
    marginTop: responsiveHeight(5.3),
    marginLeft: 20,
    marginBottom: 25,
    color: '#000',
  },
  withdrawalText: {
    top: responsiveHeight(6),
    right: responsiveWidth(5),
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#888888',
    fontFamily: 'Pretendard-Medium',
    color: '#888888',
  },
  menuSheet: {
    width: responsiveWidth(100),
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 2,
    height: 55,
  },
  menuText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    marginLeft: 20,
    marginTop: 16,
  },
  arrowBtnStyle: {
    alignSelf: 'center',
    position: 'absolute',
    right: responsiveWidth(5),
  },
  blank: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 200,
    marginTop: 15,
  },
  verText: {
    color: '#888888',
    fontSize: 12,
    fontFamily: 'Pretendard-Light',
    marginLeft: responsiveWidth(85),
    marginTop: 20,
  },
  inputWrapper: {
    marginTop: 20,
    position: 'relative',
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textInput: {
    width: responsiveWidth(62),
    height: responsiveHeight(7),
    marginLeft: -8,
    color: '#232323',
    borderWidth: 1,
    borderColor: '#AFAFAF',
    borderRadius: 5,
    paddingLeft: 20,
    fontFamily: 'Pretendard-Bold',
  },
  duplicationBtn: {
    width: responsiveWidth(23.5),
    height: responsiveHeight(7),
    justifyContent: 'center',
    borderColor: '#585FFF',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 13,
  },
  duplicationText: {
    color: '#585FFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.98),
  },
  inputText: {
    color: '#AFAFAF',
    right: 8,
    marginTop: -12,
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
  },
  errorText: {
    color: '#F05D5D',
    right: 8,
    marginTop: -12,
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
  },
  passText: {
    color: '#00B528',
    right: 8,
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    marginTop: -17,
  },
  errorImg: {
    width: 18,
    height: 18,
    position: 'absolute',
    left: responsiveWidth(50),
    top: responsiveHeight(2.3),
  },
  newSvg: {
    alignSelf: 'center',
    left: responsiveWidth(3),
  },
});

export default MyPage;
