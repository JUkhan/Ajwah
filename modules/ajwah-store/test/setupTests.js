import { bootstrap, store } from '../src/storeContext'
import { Counter } from './store/states'

bootstrap({
    states: [Counter],
    //effects: []
})
global.store = store()

