import {
  UPDATE_ALIENS,
  UPDATE_LASERS,
  ADD_LASER,
  UPDATE_CURSOR,
  GAME_OVER,
  PAUSE,
} from '../actions/object';

const initialState = {
  aliens: [],
  lasers: [],
  cursorPos: null,
  isPaused: false,
  isGameOver: false,
  isInitd: false,
};
export default function objectsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_LASER:
      return {
        ...state,
        lasers: [...state.lasers, action.payload],
      };
    case UPDATE_ALIENS:
      return {
        ...state,
        aliens: action.payload,
      };
    case UPDATE_LASERS:
      return {
        ...state,
        lasers: action.payload,
      };
    case UPDATE_CURSOR:
      return {
        ...state,
        cursorPos: action.payload,
      };
    case PAUSE:
      return {
        ...state,
        isPaused: action.payload,
      };
    case GAME_OVER:
      return {
        ...state,
        isGameOver: action.payload,
        isInitd: true,
      };
    default:
      return state;
  }
}
