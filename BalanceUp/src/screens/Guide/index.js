import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import FastImage from 'react-native-fast-image';

import Crystal from '../../resource/image/Modal/Crystal.png';
import routine from '../../resource/image/Modal/10routine.png';
import first from '../../resource/image/Guide/1st.png';
import second from '../../resource/image/Guide/2nd.png';
import third from '../../resource/image/Guide/3rd.png';
import Top from './Top';
import {responsiveWidth} from 'react-native-responsive-dimensions';

export default function Guide({navigation: {navigate}}) {
  return (
    <ScrollView style={styles.container}>
      <Top navigate={navigate} />
      <View style={{alignItems: 'center', marginTop: 30}}>
        <Shadow distance={8} startColor="#f0f0f0" offset={[2, 2]}>
          <View style={styles.infoSheet}>
            <Text style={[styles.infoText, {marginTop: 25}]}>
              설정한 루틴을 완료하면
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.point}>RP</Text>를 얻을 수 있어요!
            </Text>
            <View style={{flexDirection: 'row'}}>
              <View>
                <FastImage source={Crystal} style={styles.img} />
              </View>
              <View>
                <FastImage
                  source={Crystal}
                  style={[styles.img, {marginLeft: 0, right: 12}]}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: -10}}>
              <View style={{alignItems: 'center', marginRight: 50}}>
                <Text style={styles.infoText_}>오늘의 루틴 완료</Text>
                <Text style={[styles.infoText_, {color: '#585FFF', top: 1}]}>
                  +1RP
                </Text>
              </View>
              <View style={{alignItems: 'center', left: 5}}>
                <Text style={styles.infoText_}>2주 루틴 100% 완료</Text>
                <Text style={[styles.infoText_, {color: '#585FFF', top: 1}]}>
                  +10RP
                </Text>
              </View>
            </View>
            <View style={styles.space}>
              <Text style={styles.infoText__}>
                ex) 월, 수, 금 루틴을 설정했다면, 2주 동안 총 6일 루틴을
              </Text>
              <Text style={styles.infoText__sub}>진행해야 해요!</Text>
              <Text style={styles.infoText__sub}>
                - 6일 중 5일 완료 시 +5RP 획득
              </Text>
              <Text style={styles.infoText__sub}>
                - 6일 중 6일 모두 완료 시 +16RP (6RP+10RP) 획득
              </Text>
            </View>
          </View>
        </Shadow>
      </View>
      <View style={{alignItems: 'center', marginTop: 30}}>
        <Shadow distance={8} startColor="#f0f0f0" offset={[2, 2]}>
          <View style={styles.infoSheet_}>
            <Text style={[styles.infoText, {marginTop: 25}]}>
              <Text style={styles.point}>RP</Text>를 모으면
            </Text>
            <Text style={styles.infoText}>캐릭터 레벨이 높아져요!</Text>
            <View>
              <FastImage source={routine} style={styles.img_} />
            </View>
            <Text style={[styles.infoText_, {top: 10}]}>
              +20RP 획득 시 <Text style={styles.point}>LEVEL UP!</Text>
            </Text>
          </View>
        </Shadow>
      </View>
      <View style={{alignItems: 'center', marginTop: 30}}>
        <Shadow distance={8} startColor="#f0f0f0" offset={[2, 2]}>
          <View style={styles.infoSheet__}>
            <Text style={[styles.infoText, {marginTop: 25}]}>
              <Text style={styles.point}>레벨</Text>에 따라
            </Text>
            <Text style={styles.infoText}>캐릭터가 진화해요!</Text>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <View>
                <FastImage source={first} style={styles.img___} />
              </View>
              <View>
                <FastImage
                  source={second}
                  style={[styles.img___, {marginLeft: 0, right: 5}]}
                />
              </View>
              <View>
                <FastImage
                  source={third}
                  style={[styles.img___, {marginLeft: 0, right: 12}]}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{alignItems: 'center', right: 40}}>
                <Text style={styles.infoText_}>Lv. 1~5</Text>
                <Text style={styles.infoText__sub}>+0~99RP 획득</Text>
              </View>
              <View style={{alignItems: 'center', left: 2}}>
                <Text style={styles.infoText_}>Lv. 6~15</Text>
                <Text style={styles.infoText__sub}>100~299RP 획득</Text>
              </View>
              <View style={{alignItems: 'center', left: 43}}>
                <Text style={styles.infoText_}>Lv. 16</Text>
                <Text style={styles.infoText__sub}>300RP 이상 획득</Text>
              </View>
            </View>
            <View style={styles.space}>
              <Text style={styles.infoText__}>
                - 동시에 진행 가능한 루틴은 총 4개예요!
              </Text>
              <Text style={styles.infoText__sub}>
                - 루틴 완료를 취소할 경우, 획득한 RP가 사라져요.
              </Text>
              <Text style={styles.infoText__sub}>
                - 루틴을 삭제할 경우, 루틴과 함께 획득한 RP가 사라져요.
              </Text>
              <Text style={[styles.infoText__sub, {marginLeft: 7.8}]}>
                루틴도, RP도 되돌릴 수 없으니 신중히 선택해 주세요!
              </Text>
              <Text style={styles.infoText__sub}>
                - RP 변화에 따라 캐릭터가 이전 모습으로 바뀔 수 있어요
              </Text>
              <Text style={styles.infoText__sub}>
                - 최종레벨은 16이지만, RP는 계속 모을 수 있어요.
              </Text>
            </View>
          </View>
        </Shadow>
      </View>
      <View style={{height: 40}} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F9',
    flex: 1,
  },
  point: {
    color: '#585FFF',
    fontFamily: 'Pretendard-Bold',
  },
  infoSheet: {
    width: responsiveWidth(90),
    height: 406,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    alignItems: 'center',
  },
  infoSheet_: {
    width: responsiveWidth(90),
    height: 273,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    alignItems: 'center',
  },
  infoSheet__: {
    width: responsiveWidth(90),
    height: 462,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    alignItems: 'center',
  },
  infoText: {
    color: '#232323',
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
  },
  infoText_: {
    fontSize: 14,
    color: '#232323',
    fontFamily: 'Pretendard-Bold',
  },
  infoText__: {
    fontSize: 12,
    marginTop: 20,
    color: '#888888',
    fontFamily: 'Pretendard-Light',
  },
  infoText__sub: {
    fontSize: 12,
    marginTop: 3,
    color: '#888888',
    fontFamily: 'Pretendard-Light',
  },
  img: {
    width: 170,
    height: 140,
    marginLeft: 10,
  },
  img_: {
    width: 270,
    height: 140,
    marginLeft: 10,
  },
  img___: {
    width: 130,
    height: 140,
    marginLeft: 10,
  },
  space: {
    width: '90%',
    marginTop: 20,
    borderTopColor: '#EBEBEB',
    borderTopWidth: 1,
  },
});
