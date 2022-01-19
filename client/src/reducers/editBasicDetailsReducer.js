import { EDIT_BASIC_DETAILS } from "../actions/types";


const initialState = {
    status: {},
    message: ""
}


export default function(state = initialState, action) {
    switch (action.type) {
      case EDIT_BASIC_DETAILS:
        
        return {
          ...state,
          
          message: action.payload.message,
          status: action.payload.status,
        };
      
      default:
        return state;
    }
}