import { Observable } from 'rxjs';
import { AjwahStore } from './ajwahStore';
import { Actions } from "./actions";
import { Action } from "./action";
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
    update(callback:(state: S)=>S):void {
      this._currentState = callback(this._currentState);
      this._emit(this._currentState);
    }
  
    dispatch( actionName: any, payload?:any): void {
      this._store.dispatch(actionName, payload);
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