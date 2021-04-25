import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import rootReducer from './modules';

const initialState = {};
const composeEnhancer = compose;
const enhancers = [];
const middleware = [thunk];

if (process.env.NODE_ENV === 'development') {
  // redux logger
  const logger = createLogger({
    collapsed: true,
    duration: true
  });
  middleware.push(logger);
}

const store = createStore(
  combineReducers({ ...rootReducer }),
  initialState,
  composeEnhancer(
    applyMiddleware(
      ...middleware // for dispatching history actions
    ),
    ...enhancers
  )
);

export default store;
