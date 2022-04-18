import { post } from "./storeType";

export interface getPostsAction {
    type: "GET_POSTS";
    payload: post[];
}
