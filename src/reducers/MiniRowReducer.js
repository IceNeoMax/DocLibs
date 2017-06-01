import {
  UPDATE_ROW,
  UPDATE_ROW_SECTION,
  UPDATE_QUEUE,
  UPDATE_QUEUE_INDEX,
  SHIFT_QUEUE,
  INCRES_DOWN,
  DECRES_DOWN,
  NET_CHANGE
} from '../actions/types';

const INITIAL_STATE = {
  dataUpdate: [],
  width:0,
  dataUpdateSection:[],
  widthSection:0,
  dataUpdateQueue:[],
  queue:0,
  downloadLength:0,
  isConnected:null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case   NET_CHANGE:
    // console.log(action.payload);
      return { ...state, isConnected:action.payload };
    case UPDATE_ROW:
    // console.log(action.payload);
    // console.log(state.width);
      return { ...state, dataUpdate: Object.assign([], action.payload.data), width:action.payload.width };
    case UPDATE_ROW_SECTION:
    // console.log(action.payload);
      return { ...state, dataUpdateSection: Object.assign([], action.payload.data), widthSection:action.payload.width };
    case UPDATE_QUEUE:
      // console.log(action.payload.queue,action.payload.width);
      return { ...state, dataUpdateQueue:Object.assign([],action.payload.queue), queue:action.payload.width };
    case UPDATE_QUEUE_INDEX:
      // console.log(action.payload);
      return { ...state, dataUpdateQueue: Object.assign([],action.payload.data), queue:action.payload.width };
    case SHIFT_QUEUE:
      let newSnippetsArray = Object.assign([], action.payload)
      // console.log(action.payload);
      // let newList2 = state.dataUpdateQueue.slice(0,1);
      return { ...state, dataUpdateQueue: newSnippetsArray };
    case INCRES_DOWN:
    // console.log(action.payload);
      return { ...state, downloadLength:action.payload };
    case DECRES_DOWN:
    // console.log(action.payload);
      return { ...state, downloadLength:action.payload };
    default:
      return state;
  }
};
