import life from '../image/SetTodo/life.png';
import education from '../image/SetTodo/education.png';
import mental from '../image/SetTodo/mental.png';
import health from '../image/SetTodo/health.png';
import lifeGray from '../image/Main/daily_off.png';
import educationGray from '../image/Main/study_off.png';
import mentalGray from '../image/Main/mind_off.png';
import healthGray from '../image/Main/health_off.png';

export const categoryImgs = {
  일상: {
    true: lifeGray,
    false: life,
  },
  학습: {
    true: educationGray,
    false: education,
  },
  마음관리: {
    true: mentalGray,
    false: mental,
  },
  운동: {
    true: healthGray,
    false: health,
  },
};
