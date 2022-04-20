import { Dispatch } from "redux";
import { ActionTypes } from "./types";

export interface SetValueAction {
    type: ActionTypes.SETvalue;
    payload: { property: string; value: any };
}

export const setValueActionCreator = (payload: { property: string; value: any }) => {
    return async (dispatch: Dispatch) => {
        dispatch<SetValueAction>({
            type: ActionTypes.SETvalue,
            payload: payload,
        });
    };
};
