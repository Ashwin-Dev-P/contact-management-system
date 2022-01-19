import { combineReducers } from 'redux';
import editBasicDetailsReducer from './editBasicDetailsReducer';

export default combineReducers({
  //editBasicDetailsReducer: editBasicDetailsReducer
  basicDetails: editBasicDetailsReducer,
});