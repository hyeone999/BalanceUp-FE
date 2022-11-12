import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import MainScreen from './src/screens/home/MainScreen';
import NameScreen from './src/screens/register/NameScreen';
import AgreeScreen from './src/screens/register/AgreeScreen';
import UseInfoScreen from './src/screens/register/UseInfoScreen';
import ServiceInfoScreen from './src/screens/register/ServiceInfoScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Name"
          component={NameScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Agree"
          component={AgreeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UseInfo"
          component={UseInfoScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ServiceInfo"
          component={ServiceInfoScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
