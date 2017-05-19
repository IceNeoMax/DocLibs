import {
  UPDATE_ROW,
  UPDATE_ROW_SECTION,
  UPDATE_QUEUE,
  UPDATE_QUEUE_INDEX,
  SHIFT_QUEUE,
  INCRES_DOWN,
  DECRES_DOWN,

} from './types';

export const updateRow = (data,width) => {
  // console.log(width);
  return {
    type: UPDATE_ROW,
    payload: {data,width}
  };
};
export const updateRowSection = (data,width) => {
  // console.log(width);
  return {
    type: UPDATE_ROW_SECTION,
    payload: {data,width}
  };
};
export const updateQueue = (data,queue,width) => {
  // console.log(width);
  queue.push(data);
  return {
    type: UPDATE_QUEUE,
    payload: {queue,width}
  };
};
export const updateQueueIndex = (data,width) => {
  // console.log(width);
  return {
    type: UPDATE_QUEUE_INDEX,
    payload: {data,width}
  };
};
export const shiftQueue = (data) => {
  // console.log(width);
  data.shift();
  return {
    type: SHIFT_QUEUE,
    payload:data
  };
};
export const incresDown = (length) => {
  // console.log(width);
  length++;
  return {
    type: INCRES_DOWN,
    payload: length
  };
};
export const decresDown = (length) => {
  // console.log(width);
  length--;
  return {
    type: DECRES_DOWN,
    payload: length
  };
};
