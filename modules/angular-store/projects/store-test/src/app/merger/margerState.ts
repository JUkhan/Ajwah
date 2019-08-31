import { State, Action } from 'ajwah-angular-store'

@State({
    name: 'margerState',
    initialState: { showForm: false, id: '' }
})
export class MargerState {

    onShowForm(state, { payload }) {
        return { showForm: true, id: payload || '' }
    }

    onHideForm(state, { payload }) {
        return { showForm: false, id: payload || '' }
    }
}