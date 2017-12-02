import { combineReducers } from 'redux';
import objectsReducer from './objectsReducer';

const appReducer = combineReducers({
  objects: objectsReducer,
});

export default appReducer;
