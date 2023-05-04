import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import FastImage from 'react-native-fast-image';

import education from '../../resource/image/SetTodo/education.png';
import health from '../../resource/image/SetTodo/health.png';
import life from '../../resource/image/SetTodo/life.png';
import mental from '../../resource/image/SetTodo/mental.png';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const SetCategoryScreen = ({navigation: {navigate}}) => {
  const [disabled, setDisabled] = useState(true);
  const [selected, setSelected] = useState(new Map());
  const [todoTitle, setTodoTitle] = useState('');
  const todoData = [
    {
      id: 1,
      title: '운동',
      subTitle: '체력을 기를래요!',
      img: health,
    },
    {
      id: 2,
      title: '학습',
      subTitle: '습득력이 높아져요!',
      img: education,
    },
    {
      id: 3,
      title: '일상',
      subTitle: '지구력이 상승해요!',
      img: life,
    },
    {
      id: 4,
      title: '마음관리',
      subTitle: '회복력이 좋아져요!',
      img: mental,
    },
  ];

  // select 되었을 때의 event
  const onSelect = (id, title) => {
    if (selected === id) {
      setSelected(null);
      setDisabled(true);
      setTodoTitle('');
      return;
    }
    setSelected(id);
    setTodoTitle(title);
    setDisabled(false);
  };

  console.log(todoTitle);

  const Item = ({id, img, title, subTitle, selected, onSelect}) => {
    return (
      <View style={styles.btnSheet}>
        <Shadow distance={7} startColor="#f3f6f4" offset={[2, 2]}>
          <TouchableOpacity
            style={[
              styles.todoBtn,
              {borderWidth: selected ? 2 : null},
              {borderColor: selected ? '#585FFF' : null},
            ]}
            activeOpacity={1.0}
            onPress={() => onSelect(id, title)}>
            <FastImage source={img} style={styles.btnImg} />
            <Text style={styles.todoText}>{title}</Text>
            <Text style={styles.todoSubText}>{subTitle}</Text>
          </TouchableOpacity>
        </Shadow>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        내가 키울 루틴의 {'\n'}카테고리가 무엇인가요?
      </Text>
      <FlatList
        data={todoData}
        keyExtractor={item => item.id}
        numColumns={2}
        extraData={selected}
        renderItem={({item}) => (
          <Item
            id={item.id}
            img={item.img}
            title={item.title}
            subTitle={item.subTitle}
            selected={item.id === selected}
            onSelect={onSelect}
          />
        )}
      />
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          style={[
            styles.nextBtn,
            {backgroundColor: disabled ? '#CED6FF' : '#585FFF'},
          ]}
          activeOpacity={1.0}
          disabled={disabled}
          onPress={() => navigate('Plan', {planText: todoTitle})}>
          <Text style={styles.nextBtnText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: responsiveFontSize(2.75),
    fontFamily: 'Pretendard-Bold',
    color: '#232323',
    textAlign: 'center',
    marginTop: responsiveHeight(10),
    marginBottom: responsiveHeight(6),
  },
  btnSheet: {
    flexDirection: 'column',
    marginLeft: responsiveWidth(6),
    margin: responsiveWidth(3),
  },
  todoBtn: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    width: responsiveWidth(40.5),
    height: 140,
    marginRight: -10,
    borderRadius: 5,
  },
  todoText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    color: '#232323',
    marginTop: 5,
  },
  todoSubText: {
    fontFamily: 'Pretendard-Medium',
    color: '#888888',
    fontSize: 12,
    marginTop: 3,
  },
  btnImg: {
    width: 80,
    height: 60,
    marginTop: 10,
    marginBottom: 5,
  },
  nextBtn: {
    width: responsiveWidth(90),
    height: responsiveHeight(6.5),
    bottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  nextBtnText: {
    fontSize: responsiveFontSize(1.98),
    fontFamily: 'Pretendard-Medium',
    color: '#fff',
  },
});

export default SetCategoryScreen;
