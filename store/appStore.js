import { createStore, compose, applyMiddleware } from 'redux';
import appReducer from '../reducers/appReducer';
import thunk from 'redux-thunk';

const reducer = appReducer;

const enhancer = compose(applyMiddleware(thunk));

const store = createStore(reducer, enhancer);

export default store;
