import { combineReducers } from 'redux';
import MiniRowReducer from './MiniRowReducer';


export default combineReducers({
  miniRow: MiniRowReducer
});
