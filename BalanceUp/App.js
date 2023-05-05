import * as React from 'react';

import {HomeStackScreen} from './src/routers/onBoardingRouter';
import {RecoilRoot} from 'recoil';
import SplashScreen from 'react-native-splash-screen'; /** 추가 **/

function App() {
  React.useEffect(() => {
    try {
      setTimeout(() => {
        SplashScreen.hide(); /** 추가 **/
      }, 3000); /** 스플래시 시간 조절 (3초) **/
    } catch (e) {
      console.warn('에러발생');
      console.warn(e);
    }
  });

  return (
    <RecoilRoot>
      <HomeStackScreen />
    </RecoilRoot>
  );
}
export default App;
