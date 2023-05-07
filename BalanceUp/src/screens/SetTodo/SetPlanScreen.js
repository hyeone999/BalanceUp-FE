import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  Switch,
  FlatList,
  DeviceEventEmitter,
} from 'react-native';
import Toast from 'react-native-easy-toast';
import DatePicker from 'react-native-date-picker';
import modalInnerStyles from '../../css/modalStyles';
import styles from '../../css/SetPlanScreenStyles';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import BackArrow from '../../resource/image/Common/backArrow.svg';
import {createRoutine, modifyRoutine} from '../../actions/routineAPI';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {nickNameState} from '../../recoil/atom';
import {routineStateNum} from '../../recoil/appState';
import {alarmChanged} from '../../recoil/userState';
import {dayData} from '../../resource/data/SetPlanScreenText';

const SetPlanScreen = ({navigation: {navigate}, route}) => {
  const {planText, routineId, routineTitle, days, alarm} = route.params;

  const toastRef = useRef();

  const nickName = useRecoilValue(nickNameState);
  const setAlarmChanged = useSetRecoilState(alarmChanged);
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState(new Map());
  const [todoText, setTodoText] = useState('');

  const [dayText, setDayText] = useState([]);

  const [clearModalVisible, setClearModalVisible] = useState(false);

  const [isEnabled, setIsEnabled] = useState(false);

  const [alertHour, setAlertHour] = useState('');
  const [alertMin, setAlertMin] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false); // 알림 기본 설정 = false
  const [shouldShow, setShouldShow] = useState(false); // 알림 기본 설정 = false
  const [disabled, setDisabled] = useState(false);
  const [routineRefresh, setRoutineStateNum] = useRecoilState(routineStateNum);

  // 토스트 메세지
  const showCopyToast = useCallback(() => {
    toastRef.current.show('진행 요일은 수정할 수 없어요.');
  }, []);

  useEffect(() => {
    return () => {
      DeviceEventEmitter.emit('refresh');
    };
  }, []);

  useEffect(() => {
    PushNotification.setApplicationIconBadgeNumber(0);
  }, []);

  // 루틴 수정모드 기능 처리
  useEffect(() => {
    if (routineId != null) {
      setIsEditing(true);
      setTodoText(routineTitle);
      setTime(alarm);
    }
    // alarm이 있을경우 switch on 처리
    if (alarm != null) {
      setIsEnabled(true);
      setShouldShow(true);
    }
  }, [routineId, routineTitle, alarm]);

  // 버튼 활성화/비활성화
  useEffect(() => {
    setDisabled(todoText.length !== 0 && dayText.length !== 0 ? false : true);
  }, [todoText.length, dayText.length]);

  // 팝업 알림 설정 구현
  const notify = (routineId, days, alarmTime) => {
    let activeDays = [dayText];

    PushNotification.channelExists('channel-id', function (exists) {
      console.log(exists); // true/false
    });
    console.log(activeDays);
    activeDays.map((day, index) => {
      if (day === 1) {
        PushNotification.createChannel(
          {
            channelId: `${todoText}${index}`,
            channelName: 'My channel',
            channelDescription: 'A channel to categorise your notifications',
            playSound: false,
            soundName: 'default',
            vibrate: true,
          },
          created => console.log(`createChannel returned '${created}'`),
        );

        PushNotification.localNotificationSchedule({
          channelId: `${todoText}${index}`,
          title: todoText,
          message: `${nickName}님, 오늘의 루틴을 완료해보세요!`,
          date: calculateDateByDay(index),
          repeatType: 'week',
        });
      }
    });
  };

  // 팝업 알람 날짜 계산
  const calculateDateByDay = index => {
    let now = new Date();
    let m = moment().utcOffset(0);
    m.set({hour: alertHour, minute: alertMin, second: 0, millisecond: 0});
    console.log(now.getDay());

    const daysFromNow = index - now.getDay();
    if (daysFromNow <= 0) {
      // 요일 초과시 다음주로
      m = moment(m).add(daysFromNow + 7, 'day');
    } else {
      m = moment(m).add(daysFromNow, 'day');
    }
    m.toDate();

    var retrunTime = new Date(m);

    console.log(retrunTime);
    return retrunTime;
  };
  console.log(isEditing);

  // 요일 선택 기능 구현
  const handleSelect = useCallback(
    (id, title) => {
      setSelected(selected => {
        const newSelected = new Map(selected);
        newSelected.set(id, !selected.get(id));
        !selected.get(id) ? dayText.push(title) : dayText.pop();
        return newSelected;
      });
    },
    [dayText],
  );

  // 시간 토글 스위치 구현
  const handleSwitchOn = () => {
    setShouldShow(!shouldShow);
    isEnabled ? setTime('') : setTime('09:00');
  };

  // 루틴 설정 완료 버튼 구현
  const handleCheck = () => {
    setClearModalVisible(!clearModalVisible);
    // 요일 순으로 정렬
    setDayText(
      [...dayText].sort(
        (a, b) =>
          dayData.map(day => day.title).indexOf(a) -
          dayData.map(day => day.title).indexOf(b),
      ),
    );
  };

  // 루틴 생성
  const handleCreate = async () => {
    await createRoutine(todoText, planText, dayText, time).then(res => {
      if (res === '루틴 갯수는 4개를 초과할 수 없습니다.') {
        setClearModalVisible(false);
        navigate('Home', {overRoutine: 'over'});
      } else {
        setClearModalVisible(false);

        // 알림 설정
        let tmp = JSON.parse(JSON.stringify(alarmChanged));
        setAlarmChanged(tmp + 1);
        // seloctor 업데이트를 위해+1
        let tmpNum = JSON.parse(JSON.stringify(routineRefresh));
        setRoutineStateNum(tmpNum + 1);
        navigate('Home');
      }
    });
  };

  // 루틴 수정
  const handleEdit = async () => {
    await modifyRoutine(routineId, todoText, days, time).then(
      setClearModalVisible(false),
      // navigate('Home'),
    );
    let tmpArray = [];
    let tmpId = routineId;

    PushNotification.getScheduledLocalNotifications(callback => {
      for (var i = 0; i < callback.length; i++) {
        if (callback[i].id.slice(0, 3) === String(tmpId).slice(0, 3)) {
          // id 만자리수 대비
          // ***백에서 각 알림별 id 따로 받아와 처리
          tmpArray.push(callback[i]);
        }
      }
      if (time !== undefined) {
        for (var j = 0; j < tmpArray.length; j++) {
          let beforeDate = tmpArray[j].date;
          console.log(beforeDate);
          PushNotification.deleteChannel(`${tmpId}${beforeDate}`); // 이전채널 삭제
          let m = moment(beforeDate);
          let tmpDaysStr = String(beforeDate);
          let tmpForId = tmpDaysStr.slice(8, 10); // id 구분을 위함
          tmpForId = parseInt(tmpForId);
          m.set({hour: time.split(':')[0], minute: time.split(':')[1]}); // 시간만 바꿈
          // var correctHours = moment.duration('09:00:00'); // 시간보정 이미 됬으므로 패스
          // m.subtract(correctHours);
          m.toDate();
          var tmpM = new Date(m);
          PushNotification.createChannel(
            {
              channelId: `${tmpId}${tmpM}`,
              channelName: tmpArray[j].title,
              channelDescription: 'A channel to categorise your notifications',
              playSound: false,
              soundName: 'default',
              vibrate: true,
            },
            // created => console.log(`createChannel returned '${created}'`),
          );
          PushNotification.localNotificationSchedule({
            channelId: `${tmpId}${tmpM}`,
            id: `${tmpId}${tmpForId}`,
            title: tmpArray[j].title,
            message: `${nickName}님, 오늘의 루틴을 완료해보세요!`,
            date: tmpM,
            // repeatType: 'week',
            // date: new Date(Date.now() + 20 * 1000), //시간대 에러날시 서버시간 체크후 보정
          });
        }
      }
      PushNotification.getScheduledLocalNotifications(callback2 => {
        console.log(callback2); // ['channel_id_1']
      });
    });
    // 알림 설정
    let tmp = JSON.parse(JSON.stringify(alarmChanged));
    setAlarmChanged(tmp + 1);
    // seloctor 업데이트를 위해+1
    let tmpNum = JSON.parse(JSON.stringify(routineRefresh));
    setRoutineStateNum(tmpNum + 1);
    navigate('Home');
  };

  // 요일 선택 Icon
  const Item = ({id, title, selected, handleSelect}) => {
    return (
      <TouchableOpacity
        style={[
          styles.daySelectBtn,
          {backgroundColor: selected ? '#585FFF' : '#CED6FF'},
        ]}
        activeOpacity={1.0}
        onPress={() => (isEditing ? showCopyToast() : handleSelect(id, title))}>
        <Text style={styles.btnText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Toast
          ref={toastRef}
          position="top"
          positionValue={10}
          fadeInDuration={300}
          fadeOutDuration={1500}
          style={styles.toastView}
          textStyle={styles.toastText}
        />
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={() => {
            isEditing ? navigate('Home') : navigate('Set');
          }}>
          <BackArrow style={styles.arrowBtn} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>
          나를 키울 루틴은 {'\n'}어떻게 진행되나요?
        </Text>
        <View style={styles.inputSheet}>
          <Text style={styles.inputText}>루틴명</Text>
          <Text style={styles.count}>{todoText.length}/10</Text>
          <TextInput
            style={styles.inputStyle}
            fontSize={16}
            maxLength={10}
            autoCapitalize="none"
            placeholderTextColor="#AFAFAF"
            placeholder={isEditing ? null : 'ex) 물💧 마시기!'}
            value={todoText}
            onChangeText={text => setTodoText(text)}
          />
        </View>
        <View style={styles.daySelect}>
          <Text style={styles.daySelectText}>진행 요일</Text>
          <Text style={styles.recText}>주 2일 이상 루틴을 실천해 보세요</Text>
        </View>
        <View style={styles.daySelectBtnView}>
          <FlatList
            data={dayData}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <Item
                id={item.id}
                title={item.title}
                selected={!!selected.get(item.id)}
                handleSelect={handleSelect}
              />
            )}
            keyExtractor={item => item.id}
            extraData={selected}
          />
        </View>

        <View style={styles.alertView}>
          <Text style={styles.alertText}>루틴 알림</Text>
          <Switch
            trackColor={{false: '#CED6FF', true: '#585FFF'}}
            thumbColor={isEnabled ? '#FFFFFF' : '#FFFFFF'}
            onValueChange={() => setIsEnabled(previousState => !previousState)}
            value={isEnabled}
            onChange={handleSwitchOn}
            style={[
              styles.switchStyle,
              {transform: [{scaleX: 1.1}, {scaleY: 1.1}]},
            ]}
          />
        </View>

        {/* 시간 설정 모달 코드 */}
        <View>
          {shouldShow ? (
            <View style={styles.timeView}>
              <Text style={styles.timeText}>{isEnabled ? time : ''}</Text>
              <TouchableOpacity
                style={{position: 'absolute', right: 17}}
                activeOpacity={1.0}
                hitSlop={{bottom: 10, left: 10, right: 10}}
                onPress={() => setOpen(true)}>
                <Text style={styles.timeModalText}>시간변경</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <DatePicker
            modal
            mode="time"
            open={open}
            date={date}
            locale={'en_GB'}
            is24hourSource="locale"
            minuteInterval={5}
            onConfirm={date => {
              setOpen(false);
              setDate(date);
              setAlertHour(('0' + date.getHours()).slice(-2));
              setAlertMin(('0' + date.getMinutes()).slice(-2));
              setTime(
                ('0' + date.getHours()).slice(-2) +
                  ':' +
                  ('0' + date.getMinutes()).slice(-2),
              );
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
        <View style={styles.nextBtnSheet}>
          <TouchableOpacity
            style={
              isEditing
                ? styles.nextBtn
                : [
                    styles.nextBtn,
                    {backgroundColor: disabled ? '#CED6FF' : '#585FFF'},
                  ]
            }
            activeOpacity={1.0}
            disabled={isEditing ? false : disabled}
            onPress={handleCheck}>
            <Text style={styles.nextBtnText}>완료</Text>
          </TouchableOpacity>
        </View>

        {/* 완료 모달 구현 코드 */}
        <Modal
          visible={clearModalVisible}
          animationType={'fade'}
          transparent={true}
          statusBarTranslucent={true}>
          <Pressable
            style={modalInnerStyles.modalOverlay}
            onPress={() => setClearModalVisible(!clearModalVisible)}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={{
                  ...modalInnerStyles.clearSheetContainer,
                }}>
                <Text style={modalInnerStyles.clearModalTitle}>
                  설정한 루틴이 맞나요?
                </Text>
                <View style={styles.checkView}>
                  <View style={styles.boxView}>
                    <Text style={modalInnerStyles.planText}>[{planText}]</Text>
                    <Text style={modalInnerStyles.todoText}>{todoText}</Text>
                  </View>
                  <View style={styles.boxView}>
                    {isEditing ? (
                      <Text style={modalInnerStyles.dayText}>{days}</Text>
                    ) : (
                      <Text style={modalInnerStyles.dayText}>{dayText}</Text>
                    )}
                    {shouldShow ? (
                      <Text style={modalInnerStyles.timeText}>
                        {time}에 알림
                      </Text>
                    ) : null}
                  </View>
                </View>
                <View style={modalInnerStyles.modalFlex}>
                  <TouchableOpacity
                    style={modalInnerStyles.noBtn}
                    activeOpacity={1.0}
                    onPress={() => setClearModalVisible(false)}>
                    <Text style={modalInnerStyles.noText}>아니요</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1.0}
                    onPress={isEditing ? handleEdit : handleCreate}
                    style={modalInnerStyles.yesBtn}>
                    <Text style={modalInnerStyles.nextText}>맞습니다!</Text>
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

export default SetPlanScreen;
