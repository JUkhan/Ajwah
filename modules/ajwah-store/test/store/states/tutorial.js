import { updateObject } from "./utils";

export class Tutorial {
    name = 'tutorial'
    initialState = { data: [] }

    actionAdd(state, { payload }) {
        return { data: [...state.data, payload] }
    }
    actionRemove(state, { payload }) {
        return { data: state.data.filter(_ => _.id !== payload) }
    }
}