import {
    atom,
} from 'recoil';

// Define the User type
type User = {
  user_id: number|null;
  username: string;
};

// Create the default user object
const defaultUser: User = {
  user_id: null,
  username: '',
};

export const userState = atom({
    key: 'userState', // unique ID (with respect to other atoms/selectors)
    default: defaultUser, // default value (aka initial value)
  });
  export const navHiddenState = atom({
    key: 'navHiddenState',
    default: false, // 초기값은 보이는 상태
  });