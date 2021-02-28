
import { dispatch } from '../dispatch';
import { Action } from '../action'

import { StateController} from '../stateController';
export interface Department{
    name:string,
    id:number
}
export interface DepartmentState{
    departments: Department[],
    selectedDepartment?:number
}
export class DepartmentController extends StateController<DepartmentState> {
    constructor() {
      super('department', {departments:[]});
    }
    onInit(){
        this.emit({
            departments:[
                {name:'Regional', id:1},
                {name:'Nature', id:2},
                {name:'Seasonal', id:3}
        ]
        } as DepartmentState)
    }
    onAction(state:DepartmentState, action:Action){
        if(action.type==='selectDeparment')
            this.emit({selectedDepartment:action.payload})
        
    }

    selectDepartment(){
        dispatch('selectDeparment', 2)
    }
    
  }