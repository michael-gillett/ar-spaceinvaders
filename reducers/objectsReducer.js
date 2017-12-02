import { UPDATE_ALIENS, UPDATE_LASERS, ADD_LASER } from '../actions/object';

const initialState = {
  aliens: [],
  lasers: [],
  plane: null,
};
export default function objectsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_LASER:
      return {
        ...state,
        lasers: [...state.lasers, action.payload],
      };
    // case MOVE_ALIENS:
    //   return {
    //     ...state,
    //     loading: true,
    //     search_query: action.payload,
    //   };
    case UPDATE_LASERS:
      return {
        ...state,
        lasers: action.payload,
      };
    default:
      return state;
  }
}
