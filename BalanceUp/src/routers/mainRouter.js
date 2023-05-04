import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import MainScreen from '../screens/home/MainScreen';
import LookAll from '../screens/home/LookAll';
import SetCategoryScreen from '../screens/SetTodo/SetCategoryScreen';
import SetPlanScreen from '../screens/SetTodo/SetPlanScreen';
import MyPage from '../screens/myPage/MyPage';
import Withdrawal from '../screens/myPage/Withdrawal';
import Login from '../screens/Login/Login';
import Notice from '../screens/myPage/Notice';
import Guide from '../screens/Guide';
import Name from '../screens/register/NameScreen';
import AgreeScreen from '../screens/register/AgreeScreen';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import OnHome from '../resource/image/BottomTab/home_on.svg';
import OffHome from '../resource/image/BottomTab/home_off.svg';
import OnSet from '../resource/image/BottomTab/setTodo_on.svg';
import OffSet from '../resource/image/BottomTab/setTodo_off.svg';
import OnCheck from '../resource/image/BottomTab/checkTodo_on.svg';
import OffCheck from '../resource/image/BottomTab/checkTodo_off.svg';
import OnMy from '../resource/image/BottomTab/my_on.svg';
import OffMy from '../resource/image/BottomTab/my_off.svg';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

const Tab = createBottomTabNavigator();

// BottomTab //
const ScreenTabRouter = () => {
  return (
    <Tab.Navigator
      initialRouteName="MainScreen"
      screenOptions={{
        tabBarActiveTintColor: '#585FFF',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          height: responsiveHeight(9),
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: {
          fontFamily: 'Pretendard-Bold',
          fontSize: responsiveFontSize(1.1),
          bottom: responsiveHeight(2.3),
        },
        tabBarIconStyle: {
          bottom: responsiveHeight(0.5),
        },
      }}>
      <Tab.Screen
        name="Home"
        component={MainScreen}
        options={{
          tabBarLabel: '홈',
          headerShown: false,
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => (focused ? <OnHome /> : <OffHome />),
        }}
      />
      <Tab.Screen
        name="Set"
        component={SetCategoryScreen}
        options={{
          tabBarLabel: '루틴설정',
          headerShown: false,
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => (focused ? <OnSet /> : <OffSet />),
        }}
      />
      <Tab.Screen
        name="LookAll"
        component={LookAll}
        options={{
          tabBarLabel: '루틴확인',
          headerShown: false,
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => (focused ? <OnCheck /> : <OffCheck />),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{
          tabBarLabel: 'MY',
          headerShown: false,
          unmountOnBlur: true,

          tabBarIcon: ({focused}) => (focused ? <OnMy /> : <OffMy />),
        }}
      />
    </Tab.Navigator>
  );
};

// MainRouter //
const MainStack = createStackNavigator();

export function MainRouter() {
  return (
    <NavigationContainer independent={true}>
      <MainStack.Navigator>
        <MainStack.Screen
          name="Main"
          component={ScreenTabRouter}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="Plan"
          component={SetPlanScreen}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="Withdrawal"
          component={Withdrawal}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="Notice"
          component={Notice}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="Guide"
          component={Guide}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="NickName"
          component={Name}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="Agree"
          component={AgreeScreen}
          options={{headerShown: false}}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

exports.default = MainRouter;
