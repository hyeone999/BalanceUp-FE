import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import commonStyles from '../../css/commonStyles';
import {format} from 'date-fns';
import * as Progress from 'react-native-progress';
import LevelArrow from '../../resource/image/Main/levelArrow.svg';
import LeftArrow from '../../resource/image/Main/left.svg';
import RightArrow from '../../resource/image/Main/right.svg';
import Iconx from '../../resource/image/Main/back.svg';
import lv1 from '../../resource/image/Main/1lv.gif';
import lv2 from '../../resource/image/Main/2lv.gif';
import lv3 from '../../resource/image/Main/3lv.gif';
import lv2Modal from '../../resource/image/Main/secondLevelModal.png';
import lv3Modal from '../../resource/image/Main/lastLevelModal.png';
import {
  LocaleConfig,
  ExpandableCalendar,
  CalendarProvider,
} from 'react-native-calendars';
import {Shadow} from 'react-native-shadow-2';
import {Progress as ProgressComponent} from './Progress';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {dateState, routineStateNum} from '../../recoil/appState';
import {nickNameState, userRpState, jwtState} from '../../recoil/atom';
import {routineStateDaysSet, alarmChanged} from '../../recoil/userState';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import PushNotification from 'react-native-push-notification';

import moment from 'moment';
import {
  LEVELRPSTATE,
  LEVELSTATE,
  UPRPSTATE,
} from '../../resource/data/LevelData';

LocaleConfig.locales.fr = {
  monthNames: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ],
  monthNamesShort: [
    'Janv.',
    'Févr.',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juil.',
    'Août',
    'Sept.',
    'Oct.',
    'Nov.',
    'Déc.',
  ],
  dayNames: ['일', '월', '화', '수', '목', '금', '토'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
};
LocaleConfig.defaultLocale = 'fr';

let today = new Date();
let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1; // 월
let date = today.getDate(); // 날짜

const MainScreen = ({navigation: {navigate}}) => {
  const nickName = useRecoilValue(nickNameState);
  const routineRefresh = useRecoilValue(routineStateNum);
  const alarmChange = useRecoilValue(alarmChanged);
  const userRp = useRecoilValue(userRpState);
  const token = useRecoilValue(jwtState);
  const [userLevel, setUserLevel] = useState(1);
  const [upRp, setUpRp] = useState(20);
  const [nextLevel, setNextLevel] = useState(2);
  const [tmp, setTmp] = useState(0);
  const [todoTotal, setTodoTotal] = useState([0, 0, 0, 0]);
  const [todoCompleted, setTodoCompleted] = useState([0, 0, 0, 0]);
  const setDateState = useSetRecoilState(dateState);
  const [routineDays, setRoutineDays] = useState({});
  const [checkedDateColor, setCheckedDateColor] = useState('#FFFFFF');
  const [checkedDate, setCheckedDate] = useState();
  const selectTodo = useRecoilValue(routineStateDaysSet(token, 0));
  const fomatToday =
    year.toString() + '-' + month.toString() + '-' + date.toString();
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd'),
  );
  const [levelUpModalVisible, setLevelUpModalVisible] = useState(false);
  const [levelUp_ModalVisible, setLevelUp_ModalVisible] = useState(false);
  const [showUpModal, setShowUpModal] = useState(false);
  const [gif, setGif] = useState(lv1);

  // 모달 기능 구현
  const screenHeight = Dimensions.get('screen').height;

  const panY = useRef(new Animated.Value(screenHeight)).current;

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 10,
    useNativeDriver: true,
  });

  useEffect(() => {
    if (levelUpModalVisible || levelUp_ModalVisible) {
      resetBottomSheet.start();
    }
  }, [levelUpModalVisible, levelUp_ModalVisible]);

  // RP 레벨 처리
  useEffect(() => {
    for (let i = 0; i < 14; i++) {
      setUserLevel(1);
      setUpRp(20);
      setNextLevel(2);
      if (userRp >= LEVELRPSTATE[i] && userRp <= LEVELRPSTATE[i + 1]) {
        setUserLevel(LEVELSTATE[i]);
        setNextLevel(LEVELSTATE[i + 1]);
        setUpRp(UPRPSTATE[i]);
        break;
      }
    }
    // 만렙 처리
    if (userRp >= 300) {
      setUserLevel(16);
    }

    // 레벨 진화 이펙트 (Modal State)
    // RP 85 ~ 99가 되면 modal 상태를 true로
    if (userRp >= 85 && userRp < 100) {
      setShowUpModal(true);
    } else if (userRp >= 285 && userRp < 300) {
      setShowUpModal(true);
    }

    // 6레벨 달성시 레벨업 Modal
    if (userLevel === 6 && showUpModal) {
      setLevelUpModalVisible(true);
      setTimeout(() => setGif(lv2), 3000);
      // 레벨업시 한번만 실행을 위해 다시 false
      setShowUpModal(false);

      // 16레벨 달성시 레벨업 Modal
    } else if (userLevel === 16 && showUpModal) {
      setLevelUp_ModalVisible(true);
      setTimeout(() => setGif(lv3), 2000);
      // 레벨업시 한번만 실행을 위해 다시 false
      setShowUpModal(false);
    }

    // 레벨에 알맞는 캐릭터 구현
    if (userLevel < 6) {
      setGif(lv1);
    } else if (userLevel >= 6 && userLevel <= 15) {
      setGif(lv2);
    }
  }, [userRp, userLevel]);

  // 루틴 날짜 객체 생성
  let tmpMonth = ('0' + month).slice(-2); // 오늘 제외
  let tmpDate = ('0' + date).slice(-2);
  let tmpToday = year + '-' + tmpMonth + '-' + tmpDate;

  const setCheckValue = () => {
    const tmpObj = {};
    for (let i = 0; i < selectTodo.length; i++) {
      if (selectTodo[i].day !== tmpToday) {
        tmpObj[selectTodo[i].day] = {
          selected: true,
          selectedColor: '#F4F7FF',
          selectedTextColor: '#000000',
        };
      } else {
        setCheckedDateColor('#F4F7FF');
        tmpObj[selectTodo[i].day] = {
          selected: true,
          selectedColor: '#585FFF',
          selectedTextColor: '#FFFFFF',
        };
      }
    }
    setRoutineDays(tmpObj);
  };

  // 날짜 누를시 선택날짜 색변화
  const checkSelectedDate = date => {
    setDateState(date);
    const tmpObj = {...routineDays};
    let tmpColor;
    if (tmpObj[date] === undefined) {
      tmpColor = '#FFFFFF';

      tmpObj[date] = {
        selected: true,
        selectedColor: '#585FFF',
        selectedTextColor: '#FFFFFF',
      };
    } else {
      tmpColor = tmpObj[date].selectedColor;
    }

    tmpObj[date].selectedColor = '#585FFF';
    tmpObj[date].selectedTextColor = '#FFFFFF';

    tmpObj[checkedDate] = {
      selected: true,
      selectedColor: checkedDateColor,
      selectedTextColor: '#000000',
    };

    setRoutineDays(tmpObj);
    setCheckedDate(date);
    setCheckedDateColor(tmpColor);
  };

  // 루틴 전체 불러오기
  const setTodo = async res => {
    res = selectTodo[selectTodo.length - 1];
    const completedTmp = [0, 0, 0, 0];
    const totalTmp = [0, 0, 0, 0];

    for (let i = 0; i < res.length; i++) {
      const category = res[i].routineCategory;
      // index = category 값에 대응하는 completedTmp와 totalTmp의 index
      const index = {일상: 0, 학습: 1, 마음관리: 2, 운동: 3}[category];
      if (res[i].completed === true) {
        completedTmp[index] += 1;
      }
      totalTmp[index] += 1;
    }

    setTodoCompleted(completedTmp);
    setTodoTotal(totalTmp);
  };

  useEffect(() => {
    // asyncGetAll();
    setCheckValue();
    setTimeout(() => {
      setTmp(5);
    }, 1000);
    setCheckedDate(tmpToday);
  }, [selectTodo]);
  useEffect(() => {
    PushNotification.setApplicationIconBadgeNumber(0);
  }, []);
  useEffect(() => {
    setTodo();
  }, [routineRefresh]);
  useEffect(() => {
    // 알림 생성 체크 후 생성
    let tmpArray = JSON.parse(
      JSON.stringify(selectTodo[selectTodo.length - 1]),
    );
    for (let i = 0; i < tmpArray.length; i++) {
      let tmpArrayDays = [];

      if (tmpArray[i].alarmTime != null) {
        for (let j = 0; j < tmpArray[i].routineDays.length; j++) {
          let m = moment().utcOffset(0);
          // console.log(tmpArray[i].routineDays[j]);
          let year = parseInt(tmpArray[i].routineDays[j].day.split('-')[0], 10);
          let month = parseInt(
            tmpArray[i].routineDays[j].day.split('-')[1],
            10,
          );
          month -= 1;
          let date = parseInt(tmpArray[i].routineDays[j].day.split('-')[2], 10);
          let hour = parseInt(tmpArray[i].alarmTime.split(':')[0], 10);
          let minute = parseInt(tmpArray[i].alarmTime.split(':')[1], 10);

          m.set({
            year: year,
            month: month,
            date: date,
            hour: hour,
            minute: minute,
            second: 0,
            millisecond: 0,
          });
          var correctHours = moment.duration('09:00:00'); // 시간보정
          m.subtract(correctHours);
          m.toDate();
          var tmpM = new Date(m);
          tmpArrayDays.push(tmpM);
        }
      }

      for (let k = 0; k < tmpArrayDays.length; k++) {
        let tmpId = tmpArray[i].routineId;
        let tmpTitle = tmpArray[i].routineTitle;
        let tmpDays = tmpArrayDays[k];
        let tmpDaysStr = String(tmpDays);
        let tmpForId = tmpDaysStr.slice(8, 10); // id 구분을 위한 날짜추가
        tmpForId = parseInt(tmpForId);
        // let strtmpDays=tmpArray[i].routineDays[k].day;
        PushNotification.channelExists(`${tmpId}${tmpDays}`, function (exists) {
          // 채널 확인후 존재하지 않으면 채널 생성후 알림 설정
          if (!exists) {
            PushNotification.createChannel({
              channelId: `${tmpId}${tmpDays}`,
              channelName: `${tmpId}${tmpDays}`,
              channelDescription: 'A channel to categorise your notifications',
              playSound: false,
              soundName: 'default',
              vibrate: true,
            });
            PushNotification.localNotificationSchedule({
              channelId: `${tmpId}${tmpDays}`,
              id: `${tmpId}${tmpForId}`, // id must 32bit integer
              title: tmpTitle,
              message: `${nickName}님, 오늘의 루틴을 완료해보세요!`,
              date: tmpDays,
            });
            PushNotification.getScheduledLocalNotifications(callback => {
              console.log(callback);
            });
          } else {
          }
        });
      }
    }
  }, [alarmChange]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollview}>
        <View style={styles.titleWrapper}>
          <View style={commonStyles.spacing2} />
          <Text style={styles.nameText}>{nickName}님은</Text>
          {userRp >= 300 ? (
            <Text style={styles.nameText}>성장을 완료 했어요</Text>
          ) : (
            <View style={commonStyles.row}>
              <Text style={styles.nextLevelText}>레벨 {userLevel}</Text>
              <Text style={styles.nameText}> 만큼 성장했어요</Text>
            </View>
          )}
          {userRp >= 300 ? (
            <Text style={styles.upText}>만렙 성공!</Text>
          ) : (
            <Text style={styles.upText}>
              {upRp}RP 달성시, Lv.{nextLevel} 레벨 업!
            </Text>
          )}

          <Image source={gif} style={styles.gifImg} />

          {/* 가이드 페이지 */}
          <TouchableOpacity
            onPress={() => navigate('Guide')}
            activeOpacity={1.0}>
            <Text style={styles.guideText}>KEYUM 성장 가이드</Text>
          </TouchableOpacity>

          {/* 레벨 progressBar */}
          <Shadow distance={5} startColor={'#f4f4f4'}>
            <View style={styles.levelContainer}>
              <View style={styles.progressStyle}>
                <View style={styles.levelSheet}>
                  <Text
                    style={[
                      styles.progressLevelText,
                      {fontSize: userLevel > 10 ? 11 : 12},
                    ]}>
                    Lv.{userLevel}
                  </Text>
                </View>
                {/* 상단 Lv, RP 부분 */}
                {userRp >= 300 ? (
                  <Text style={[styles.progressRpText_, {marginRight: 18}]}>
                    {userRp} RP
                  </Text>
                ) : (
                  <Text style={[styles.progressRpText_, {marginRight: 23}]}>
                    {userRp}/{upRp} RP
                  </Text>
                )}
              </View>
              {/* 프로그레스바 부분 */}
              <Progress.Bar
                progress={userRp < 300 ? userRp / upRp : userRp / 999}
                width={responsiveWidth(76)}
                height={7}
                color={'#585FFF'}
                borderColor={'#FFFFFF'}
                unfilledColor={'#CED6FF'}
                style={styles.progress}
              />
              {userRp <= 999 ? (
                <LevelArrow
                  style={[
                    dstyleText(
                      (userRp < 300 ? userRp / upRp : userRp / 999) *
                        responsiveWidth(75.5),
                    ).bar,
                    {position: 'absolute'},
                  ]}
                />
              ) : (
                // 만렙 처리
                <LevelArrow
                  style={[
                    dstyleText((999 / 999) * responsiveWidth(75.5)).bar,
                    {position: 'absolute'},
                  ]}
                />
              )}
              <View style={{alignItems: 'center', position: 'absolute'}}>
                <View
                  style={[
                    styles.levelSheet_,
                    dstyleText(
                      (userRp < 300 ? userRp / upRp : userRp / 999) *
                        responsiveWidth(75.5),
                    ).bar,
                    {top: responsiveHeight(3.8), left: responsiveWidth(-1.7)},
                  ]}>
                  <View style={styles.talkBubbleTriangle} />
                  {userRp <= 999 ? (
                    <Text style={styles.progressLevelText}>{userRp}</Text>
                  ) : (
                    <Text style={[styles.progressLevelText, {fontSize: 9}]}>
                      999+
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </Shadow>
          <View style={commonStyles.spacing2} />
        </View>

        {/* 이번 주 루틴 기록 */}
        <View style={commonStyles.spacing2} />
        <View style={[commonStyles.row]}>
          <Text
            style={[
              commonStyles.boldText_,
              styles.centering,
              styles.mainText4,
            ]}>
            이번 주 루틴 기록이에요
          </Text>
          <TouchableOpacity
            style={styles.showAllBtn}
            activeOpacity={1.0}
            onPress={() => navigate('LookAll')}>
            <Text style={styles.btnText}> &nbsp; 전체보기 &nbsp;</Text>
          </TouchableOpacity>
        </View>
        <CalendarProvider date={fomatToday}>
          <ExpandableCalendar
            monthFormat={'MM월'}
            renderArrow={direction => {
              if (direction === 'left') {
                return <LeftArrow style={{right: 25}} />;
              } else {
                return <RightArrow style={{left: 25}} />;
              }
            }}
            allowShadow={false}
            markedDates={routineDays}
            theme={{
              textMonthFontWeight: '800',
              selectedDayBackgroundColor: '#585FFF',
              dotColor: '#F4F7FF',
              todayTextColor: '#009688',
              dayTextColor: '#232323',
              textMonthFontFamily: 'Pretendard-Bold',
              textDayFontFamily: 'Pretendard-Medium',
              textDayHeaderFontFamily: 'Pretendard-Medium',
              textDayHeaderFontSize: 14,
              textDayFontSize: 14,
              textMonthFontSize: 16,
              'stylesheet.calendar.header': {
                header: {
                  flexDirection: 'row',
                  justifyContent: 'center',
                  paddingLeft: 50,
                  paddingRight: 50,
                  marginTop: 6,
                  alignItems: 'center',
                  color: 'red',
                },
                dayHeader: {
                  color: '#888888',
                },
              },
            }}
            onDayPress={day => {
              setSelectedDate(day.dateString);
              checkSelectedDate(day.dateString);
            }}
          />
        </CalendarProvider>
        <ProgressComponent />
        <View style={commonStyles.spacing2} />

        {/* 6레벨 진화 모달 */}
        <Modal
          visible={levelUpModalVisible}
          animationType={'fade'}
          transparent={true}
          statusBarTranslucent={true}>
          <TouchableWithoutFeedback>
            <Animated.View style={{alignItems: 'center'}}>
              <TouchableOpacity
                activeOpacity={1.0}
                onPress={() => setLevelUpModalVisible(!levelUpModalVisible)}
                style={styles.levelUpModalBtn}>
                <Iconx />
              </TouchableOpacity>
              <Text style={styles.levelUpModalText}>축하합니다!</Text>
              <Text style={[styles.levelUpModalText]}>
                캐릭터가 첫 번째 성장했어요
              </Text>
              <Text style={styles.levelUpModalText_}>
                루틴을 열심히 진행하셨군요
              </Text>
              <Text style={[styles.levelUpModalText_]}>
                앞으로도 꾸준히 루틴을 실천해 주세요!
              </Text>
              <Image source={lv2Modal} style={styles.levelUpModalImg} />
            </Animated.View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* 최종 진화 모달 */}
        <Modal
          visible={levelUp_ModalVisible}
          animationType={'fade'}
          transparent={true}
          statusBarTranslucent={true}>
          <TouchableWithoutFeedback>
            <Animated.View style={{alignItems: 'center'}}>
              <TouchableOpacity
                activeOpacity={1.0}
                onPress={() => setLevelUp_ModalVisible(!levelUp_ModalVisible)}
                style={styles.levelUpModalBtn}>
                <Iconx />
              </TouchableOpacity>
              <Text style={styles.levelUpModalText}>축하합니다!</Text>
              <Text style={[styles.levelUpModalText]}>
                캐릭터가 최종 성장했어요
              </Text>
              <Text style={styles.levelUpModalText_}>
                루틴이 이제 익숙해지셨나요?
              </Text>
              <Text style={[styles.levelUpModalText_]}>
                앞으로도 꾸준히 루틴을 실천해 주세요!
              </Text>
              <Image source={lv3Modal} style={styles.levelUpModalImg} />
            </Animated.View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const dstyleText = x =>
  StyleSheet.create({
    bar: {
      marginLeft: x + 17,
      marginTop: 50.5,
    },
  });

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  titleWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFBFF',
  },
  showAllBtn: {
    position: 'absolute',
    right: 23,
    width: 65,
    height: 26,
    paddingTop: 3,
    borderColor: '#EBEBEB',
    borderWidth: 1,
    borderRadius: 5,
  },
  btnText: {
    fontSize: 12,
    right: 1,
    textAlign: 'center',
    color: '#888888',
    fontFamily: 'Pretendard-Medium',
  },
  scrollview: {
    width: '100%',
  },
  aimText1: {
    paddingLeft: 20,
    paddingRight: 100,
    paddingTop: 10,
  },
  nameText: {
    fontSize: responsiveFontSize(2.75),
    color: '#232323',
    fontFamily: 'Pretendard-Bold',
  },
  levelContainer: {
    width: responsiveWidth(86),
    height: 110,
    paddingTop: 15,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  levelSheet: {
    width: 36,
    height: 18,
    top: 5,
    marginLeft: 20,
    backgroundColor: '#585FFF',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelSheet_: {
    width: 29,
    height: 19,
    borderRadius: 2,
    alignItems: 'center',
    backgroundColor: '#585FFF',
    justifyContent: 'center',
  },
  progressLevelText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Bold',
    color: '#FFFFFF',
  },
  progressRpText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
  },
  progressRpText_: {
    fontSize: 12,
    marginRight: responsiveWidth(4),
    fontFamily: 'Pretendard-Bold',
    color: '#888888',
    top: 5,
  },
  progresPointText: {
    fontSize: 12,
    top: 5,
    color: '#BCBCBC',
    fontFamily: 'Pretendard-Medium',
  },
  nextLevelText: {
    fontSize: responsiveFontSize(2.75),
    color: '#585FFF',
    fontFamily: 'Pretendard-Bold',
  },
  upText: {
    fontSize: responsiveHeight(1.6),
    color: '#232323',
    fontFamily: 'Pretendard-Medium',
    marginTop: responsiveHeight(0.8),
  },
  guideText: {
    color: '#888888',
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Pretendard-Medium',
    textDecorationLine: 'underline',
    marginLeft: responsiveWidth(59),
    marginBottom: responsiveHeight(3),
  },
  mainText4: {
    paddingRight: 60,
  },
  centering: {
    alignItems: 'center',
    paddingLeft: 20,
    color: '#232323',
  },
  gifImg: {
    marginTop: responsiveHeight(-2),
    marginBottom: responsiveWidth(-7),
    resizeMode: 'stretch',
    height: 380,
    width: 380,
  },
  progress: {
    marginTop: 50,
    marginLeft: 20,
    borderRadius: 10,
    bottom: 30,
  },
  img4: {
    width: 90,
    height: 90,
    borderRadius: 150 / 2,
    overflow: 'hidden',
  },
  grayImg: {
    width: 60,
    height: 60,
    borderRadius: 150 / 2,
    overflow: 'hidden',
    marginLeft: 15,
    marginTop: 15,
  },
  notCompletedSheet: {
    width: 90,
    height: 90,
    shadowColor: '#ababab',
    elevation: 15,
    borderRadius: 150 / 2,
    borderColor: '#000000',
    zIndex: 99, // added zIndex
    backgroundColor: '#FFFFFF', // added a background color
    marginTop: responsiveHeight(3),
    marginLeft: responsiveWidth(5),
    marginRight: 5,
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  levelUpModalText: {
    top: responsiveHeight(14.5),
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Pretendard-Bold',
    zIndex: 10,
  },
  levelUpModalText_: {
    top: responsiveHeight(17.5),
    color: '#888888',
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    zIndex: 10,
  },
  levelUpModalBtn: {
    left: responsiveWidth(38),
    top: responsiveHeight(7),
    zIndex: 10,
  },
  levelUpModalImg: {
    marginTop: responsiveHeight(-17),
    width: responsiveWidth(100),
    height: responsiveHeight(104),
  },
  progressStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  talkBubbleTriangle: {
    position: 'absolute',
    bottom: 14,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#585FFF',
  },
});

export default MainScreen;
