import { Observable } from 'rxjs';
import { AjwahStore } from './ajwahStore';
import { Actions } from "./actions";
import { Action } from "./action";
type UpdateStateCallback<S> = (state:S) => S; 
export abstract class StateController<S> {
    private _stateName:string;
    private  _currentState:S;
    private _emit: any;
    private _store: AjwahStore;
    constructor(
      stateName:string,
      initialState:S,
      store?:AjwahStore,
    )   {
      this._currentState = initialState;
      this._stateName = stateName;
      this._store = store instanceof AjwahStore?store: new AjwahStore();
      this._store.registerState<S>({
          stateName: this._stateName,
          initialState: this._currentState,
          mapActionToState: (state, action, emit)=> {
            this._currentState = state;
            this._emit = emit;
            this.onAction(state, action);
          }});
    }

    update(stateOrCallback:UpdateStateCallback<S>|S):void {
      const cb = stateOrCallback as any;
      this._currentState =(typeof cb ==='function')? cb(this._currentState):cb;
      this._emit(this._currentState);
    }
  
    dispatch<V extends Action = Action>(actionName: V): void;
    dispatch(actionName: string): void;
    dispatch(actionName: string, payload?: any): void;
    dispatch(actionName: string | Action, payload?: any): void {
      this._store.dispatch(actionName as any, payload);
    }
  
    get actions(): Actions{
        return this._store.actions;
    }
    get stream$(): Observable<S>{
        return this._store.select(this._stateName);
    }
    get currentState(): S{
      return this._currentState;
    }
    dispose() :void{
      this._store.dispose();
    }
    get store(): AjwahStore{
      return this._store;
    }
    protected onAction(state: S, action: Action){}
  }
  