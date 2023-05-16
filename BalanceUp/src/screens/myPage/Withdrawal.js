import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {userWithdraw} from '../../actions/memberJoinApi';
import CheckOn from '../../resource/image/Agree/check_on.svg';
import CheckOff from '../../resource/image/Agree/check_off.svg';
import BackArrow from '../../resource/image/Common/backArrow.svg';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {show} from '../../recoil/atom';
import {useSetRecoilState} from 'recoil';

const Withdrawal = ({navigation: {navigate}}) => {
  const [useCheck, setUseCheck] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const setShowIcon = useSetRecoilState(show);

  const useBtnEvent = () => {
    useCheck === false ? setUseCheck(true) : setUseCheck(false);
  };

  useEffect(() => {
    setDisabled(!useCheck);
  }, [useCheck]);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity
          onPress={() => navigate('MyPage')}
          activeOpacity={1.0}>
          <BackArrow style={styles.arrowBtn} />
        </TouchableOpacity>
        <View style={styles.topSheet}>
          <Text style={styles.topTitle}>회원 탈퇴</Text>
          <Text style={styles.subText}>아래 유의사항을 확인해 주세요</Text>
        </View>
        <View style={styles.infoSheet}>
          <View style={{flexDirection: 'row', top: 8}}>
            <Text style={styles.info_Text}>1.</Text>
            <Text style={styles.infoText}>
              루틴 기록, 캐릭터 성장을 포함하여 회원님이
            </Text>
          </View>
          <Text style={[styles.infoText, {left: 19.5}]}>
            설정한 정보가 모두 삭제됩니다.
          </Text>
          <View style={{flexDirection: 'row', marginTop: 8}}>
            <Text style={styles.info_Text}>2.</Text>
            <Text style={[styles.infoText, {right: 12}]}>
              삭제된 데이터는 복구되지 않습니다.
            </Text>
          </View>
        </View>
        <View style={styles.agreeSheet}>
          {useCheck ? (
            <CheckOn style={styles.allCheckBox} onPress={useBtnEvent} />
          ) : (
            <CheckOff style={styles.allCheckBox} onPress={useBtnEvent} />
          )}
          <Text style={styles.agreeText}>
            위 내용에 동의하고 탈퇴하겠습니다
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.Nextbutton,
          {backgroundColor: disabled ? '#CED6FF' : '#585FFF'},
        ]}
        onPress={() =>
          userWithdraw().then(() => {
            setShowIcon(true);
            navigate('Login');
          })
        }
        activeOpacity={1.0}
        disabled={disabled}>
        <Text style={styles.NextbuttonText}>탈퇴하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  arrowBtn: {
    top: responsiveWidth(8),
    left: responsiveWidth(5),
  },
  topSheet: {
    alignItems: 'center',
    marginTop: responsiveHeight(7),
  },
  topTitle: {
    color: '#000',
    fontSize: 22,
    marginTop: 8,
    fontFamily: 'Pretendard-Bold',
  },
  subText: {
    color: '#232323',
    marginTop: 10,
    fontFamily: 'Pretendard-Medium',
  },
  infoSheet: {
    backgroundColor: '#F8F8F9',
    marginTop: 25,
    marginLeft: 20,
    width: responsiveWidth(90),
    height: responsiveHeight(15),
  },
  infoText: {
    color: '#232323',
    fontFamily: 'Pretendard-Light',
    marginLeft: 20,
    marginTop: responsiveHeight(1.4),
    right: 10,
  },
  info_Text: {
    color: '#232323',
    fontFamily: 'Pretendard-Light',
    marginLeft: 20,
    marginTop: responsiveHeight(1.4),
  },
  agreeSheet: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 20,
    marginLeft: 20,
  },
  agreeText: {
    marginTop: 3,
    marginLeft: 10,
    color: '#232323',
    fontFamily: 'Pretendard-Light',
  },
  Nextbutton: {
    width: responsiveWidth(100),
    height: responsiveHeight(7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  NextbuttonText: {
    fontSize: responsiveFontSize(1.98),
    fontFamily: 'Pretendard-Medium',
    color: '#FFFFFF',
  },
});
export default Withdrawal;
