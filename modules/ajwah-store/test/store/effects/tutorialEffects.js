import { mapTo } from "rxjs/operators";

export class TutorialEffect {
    effectKey = 'dynamicKey'
    effectForAdd(action$) {
        return action$.pipe(
            mapTo({ type: 'Inc' })
        )
    }
    effectForRemove(action$) {
        return action$.pipe(
            mapTo({ type: 'Dec' })
        )
    }
}