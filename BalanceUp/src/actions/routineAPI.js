import axios from '../utils/Client';

const createRoutine = async (todoText, planText, dayText, time) => {
  let res;
  await axios
    .post('/routine', {
      routineTitle: todoText,
      routineCategory: planText,
      days: dayText.join(''),
      alarmTime: time,
    })
    .then(response => {
      console.log(response.data);
      res = response.data;
    })
    .catch(function (error) {
      console.log(error.response.data);
      res = error.response.data.message;
    });
  return res;
};

const deleteRoutine = async routineId => {
  let res;
  await axios
    .delete('/routine', {
      data: {
        routineId: routineId,
      },
    })
    .then(response => {
      console.log(response.data);
      res = response.data;
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
  return res;
};

const modifyRoutine = async (routineId, todoText, days, time) => {
  let res;
  await axios
    .put('/routine', {
      routineId: routineId,
      routineTitle: todoText,
      days: days,
      alarmTime: time,
    })
    .then(response => {
      console.log(response.data);
      res = response.data;
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
  return res;
};

const getAllRoutine = async () => {
  let res;
  await axios
    .get('/routines')
    .then(response => {
      res = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  return res;
};

const progressOneRoutine = async routineId => {
  let res;
  await axios
    .put('/progress/routine', {
      routineId: routineId,
    })
    .then(response => {
      console.log(response.data);
      res = response.data;
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
  return res;
};

const progressAllRoutine = async routineId => {
  let res;
  await axios
    .put('/progress/routines', {
      routineId: routineId,
    })
    .then(response => {
      console.log(response.data);
      res = response.data;
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
  return res;
};

const cancelOneRoutine = async (routineId, day) => {
  let res;
  await axios
    .put('/cancel', {
      routineId: routineId,
      day: day,
    })
    .then(response => {
      console.log(response.data);
      res = response.data;
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
  return res;
};

const deleteExpiredRoutine = async () => {
  let res;
  await axios
    .delete('/routines', {})
    .then(response => {
      console.log(response.data);
      res = response.data;
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
  return res;
};

export {
  createRoutine,
  deleteRoutine,
  modifyRoutine,
  getAllRoutine,
  progressOneRoutine,
  progressAllRoutine,
  cancelOneRoutine,
  deleteExpiredRoutine,
};
