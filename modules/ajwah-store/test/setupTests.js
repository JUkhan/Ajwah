import { setStoreContext, storeCtx } from '../src/storeContext'
import { Counter } from './store/states'

setStoreContext({
    states: [Counter],
    //effects: []
})
global.store = storeCtx()

