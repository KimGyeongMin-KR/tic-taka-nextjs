import {
    atom,
} from 'recoil';

// Define the User type
type User = {
  user_id: number|null;
  username: string;
  profile: string;
};
type CommentInfo = {
  id: number|null;
  comment: string;
  authorName: string;
};
// Create the default user object
const defaultUser: User = {
  user_id: null,
  username: '',
  profile: '/files/default.jpeg',
};

export const defaultReplyInfo: CommentInfo = {
  id: null,
  comment: '',
  authorName: ''
};

export const userState = atom({
    key: 'userState', // unique ID (with respect to other atoms/selectors)
    default: defaultUser, // default value (aka initial value)
  });
export const navHiddenState = atom({
  key: 'navHiddenState',
  default: false, // 초기값은 보이는 상태
});
export const replyState = atom({
  key: 'replyStateState',
  default: defaultReplyInfo, // 초기값은 보이는 상태
});