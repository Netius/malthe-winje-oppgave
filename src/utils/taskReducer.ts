
import {  emptyDeviceEntity } from "./deviceType";
import { deleteDevice, saveDevice } from "./indexDbApi";
import { EDIT_DEVICE, DELETE_DEVICE, SAVE_DEVICE } from "./taskActionTypes";

const initialState = {
  ...emptyDeviceEntity
};

const taskReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case EDIT_DEVICE:
      return {
        ...emptyDeviceEntity,
        id: action.payload.id,
        name: action.payload.name,
        serial_number: action.payload.serial_number,
        last_connection: action.payload.last_connection,
        status: action.payload.status
      };

    case SAVE_DEVICE:
      console.log(action.payload)
      saveDevice(action.payload);
      return {
        ...emptyDeviceEntity,
      }
    case DELETE_DEVICE:
      deleteDevice(action.payload)
      return {
        ...emptyDeviceEntity
      }
    default:
      return state;
  }
};

export default taskReducer;