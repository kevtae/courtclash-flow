import {LOGIN, LOGOUT} from '@actions/UserActions';

export const INITIAL_STATE = {
  wallet: '',
};

export function UserReducer(state, action) {
  switch (action.type) {
    case LOGIN:
      return {...state, ...action.payload};
    case LOGOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
}
