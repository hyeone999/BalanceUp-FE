import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import NameScreen from '../screens/register/NameScreen';
import AgreeScreen from '../screens/register/AgreeScreen';
import {MainRouter} from './mainRouter';
const NickNameStack = createStackNavigator();

// NickNameRouter : 로그인 화면에서 넘어오는 페이지
// flow : Name -> Agree -> MainRouter

export function NickNameRouter() {
  return (
    <NavigationContainer independent={true}>
      <NickNameStack.Navigator>
        <NickNameStack.Screen
          name="Name"
          component={NameScreen}
          options={{headerShown: false}}
        />
        <NickNameStack.Screen
          name="Agree"
          component={AgreeScreen}
          options={{headerShown: false}}
        />
        <NickNameStack.Screen
          name="Main"
          component={MainRouter}
          options={{headerShown: false}}
        />
      </NickNameStack.Navigator>
    </NavigationContainer>
  );
}
