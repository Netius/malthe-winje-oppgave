
import {EDIT_TASK, DELETE_TASK, SAVE_TASK} from "./taskActionTypes";

const initialState = {
  tasks: [],
  taskTitle: "",
  taskDescription: ""
};

const taskReducer = (state = initialState, action:any) => {
  switch (action.type) {
      case EDIT_TASK:
        console.log("EDIT_TASK")
          return {
              ...state,
              // tasks: [...state.tasks, action.payload],
              // taskTitle: "",
              // taskDescription: ""
          };
      case SAVE_TASK:
        console.log("SAVE_TASK")
          return {
              ...state,
              // taskTitle: action.payload,
          }
      case DELETE_TASK:
        console.log("DELETE_TASK")
          return {
              ...state,
              // taskDescription: action.payload,
          }
      default:
          return state;
  }
};

export default taskReducer;