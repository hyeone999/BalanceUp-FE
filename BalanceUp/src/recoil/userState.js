import {atom, selector, selectorFamily} from 'recoil';
import {getAllRoutine} from '../actions/routineAPI';

interface User {
  userId: String;
}

interface Routine {
  routineId: String;
  routineTitle: String;
  routineCategory: String;
  days: String;
  alarmTime: String;
  completed: Boolean;
  routineDays: {
    id: String,
    day: String,
    completed: Boolean,
  };
}

let userState = atom({
  key: 'userState',
  default: '',
});
let routineState = atom({
  key: 'routineState',
  default: [0, 0, 0, 0],
});
let routineStateComplete = atom({
  key: 'routineStateComplete',
  default: [0, 0, 0, 0],
});

let routineStateDays = atom({
  key: 'routineStateDays',
  default: [],
});

let routineStateDaysSet = selectorFamily({
  key: 'routineStateDaysSet',
  get: () => async () => {
    let res = await getAllRoutine().then(res => {
      return res;
    });
    res = res.body;
    let routineList = [];
    for (var i = 0; i < res.length; i++) {
      for (var j = 0; j < res[i].routineDays.length; j++) {
        let tmp = {
          id: res[i].routineDays[j].id,
          routineTitle: res[i].routineTitle,
          routineCategory: res[i].routineCategory,
          days: res[i].days,
          alarmTime: res[i].alarmTime,
          day: res[i].routineDays[j].day,
          routineId: res[i].routineId,
          completed: res[i].routineDays[j].completed,
        };
        routineList.push(tmp);
      }
    }
    return routineList;
  },
});
export {
  userState,
  routineState,
  routineStateComplete,
  routineStateDays,
  routineStateDaysSet,
};
