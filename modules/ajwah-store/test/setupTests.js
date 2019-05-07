import { getStoreContext } from '../src/storeContext'
import { Counter } from './store/states'

global.store = getStoreContext({
    states: [Counter],
    //effects: []
})
