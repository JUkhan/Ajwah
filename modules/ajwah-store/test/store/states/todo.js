
import { mapTo } from "rxjs/operators";
export class Todo {
    name = 'todo'
    initialState = { data: [] }

    actionAddTodo(state, { payload }) {
        return { data: [...state.data, payload] }
    }

    effectForDec(action$) {
        return action$.pipe(
            mapTo({ type: 'Inc' })
        )
    }
}