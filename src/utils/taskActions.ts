import {EDIT_DEVICE, DELETE_DEVICE, SAVE_DEVICE} from "./taskActionTypes";

export const editDevice = (value : any) => {
    return {
        type: EDIT_DEVICE,
        payload: value,
    };
};

export const saveDevice = (value:any) => {
    return {
        type: SAVE_DEVICE,
        payload: value,
    };
};

export const deleteDevice = (value : any) => {
    return {
        type: DELETE_DEVICE,
        payload: value,
    };
};