import {EDIT_TASK, DELETE_TASK, SAVE_TASK} from "./taskActionTypes";

export const editTask = (value : any) => {
    return {
        type: EDIT_TASK,
        payload: value,
    };
};

export const saveTask = (value:any) => {
    return {
        type: SAVE_TASK,
        payload: value,
    };
};

export const deleteTask = (value : any) => {
    return {
        type: DELETE_TASK,
        payload: value,
    };
};