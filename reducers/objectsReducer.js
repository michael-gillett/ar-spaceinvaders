import {
  UPDATE_ALIENS,
  UPDATE_LASERS,
  ADD_LASER,
  UPDATE_CURSOR,
} from '../actions/object';

const initialState = {
  aliens: [],
  lasers: [],
  cursorPos: null,
  plane: null,
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
    default:
      return state;
  }
}
