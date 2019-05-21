import { debounceTime, mapTo } from 'rxjs/operators';
import { ASYNC_INCREMENT, INCREMENT, DYNAMIC_EFFECTS_KEY } from './actions';
import { Actions, ofType, Store } from 'ajwah-angular-store';
import { Injectable } from '@angular/core';
import { TodoService } from '../services/todoService';


@Injectable({ providedIn: 'root' })

export class DynamicEffect {
    constructor(private todoService: TodoService) {
        console.log(this.todoService);
        //console.log(this.action$);
    }

    effectKey = DYNAMIC_EFFECTS_KEY;

    effectAsyncInc(action$: Actions) {
        return action$.pipe(
            ofType(ASYNC_INCREMENT),
            debounceTime(1000),
            mapTo({ type: INCREMENT })
        )
    }

}