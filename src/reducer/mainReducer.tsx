import { Reducer } from "redux";

import { ActionTypes } from "../actions";

import { summary } from "../types/conversation/summary";

// now only contains state from MenuProvider, could later also add in contextprovider state
interface propertySet {
    category?: number;
    id?: number;
    search?: boolean;
    profile?: number;
    menu?: boolean;
    selected?: number;
    recall?: boolean;
    data?: summary[];
    title?: string;
    smode?: number;
}

const initialState: propertySet = {};

const mainReducer: Reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SETvalue:
            return { ...state, [action.payload.property]: action.payload.value };
        default:
            return state;
    }
};

export default mainReducer;
