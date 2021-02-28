
import { RxAnimationService } from './../rx-animation.service';
import { endWith, exhaustMap, map, pluck, repeat, takeUntil, delay, mapTo } from 'rxjs/operators';
import { Todo } from './../model/todo';
import { SearchCategory, TodoState } from '../model/todo'
import { StateController, dispatch, actions$ } from 'ajwah-store';
import { Injectable } from '@angular/core';
import { Api } from '../Api';
import { merge, Observable } from 'rxjs';

@Injectable()
export class TodosController extends StateController<TodoState>{

  constructor(private api:Api, private animation:RxAnimationService) { 
    super('todo',
      {todos:[], searchCategory:SearchCategory.all}
    )
  }
  readonly SPINING_START = 'SPINING_START'
  readonly SPINING_END   = 'SPINING_END'
  readonly TODOS_ERROR   = 'TODOS_ERROR'
  onInit(){
    this.select(s=>s.searchCategory).subscribe(c=>console.log(`category:${c}`));
    this.loadTodos();
    this.exportState().subscribe(arr=>{
      console.log(arr);
      
    });
  }
  get todos$(){
    return this.stream$.pipe(map(state => {
      switch (state.searchCategory) {
          case SearchCategory.active:
              return state.todos.filter(todo => !todo.completed);
          case SearchCategory.completed:
              return state.todos.filter(todo => todo.completed);
          default:
              return state.todos;
      }
    }));
  }
  get searchCategory$(){
    return this.stream$.pipe(pluck('searchCategory'));
  } 
  get activeItem$(){
    return this.stream$.pipe(
      pluck('todos'),
      map(arr => arr?.filter(todo => !todo.completed)),
      map(arr => `${arr?.length} items left`),
    );
  }
   
  get rotate$(){
    const start$ = actions$.whereTypes(this.SPINING_START);
    const end$ = actions$.whereTypes(this.SPINING_END);
    const error$ = actions$.whereTypes(this.TODOS_ERROR);
    return start$.pipe(
      exhaustMap(() => this.animation.tween(0, 365, 500).pipe(
        repeat(),
        takeUntil(merge(end$, error$)),
        endWith(0)
      )),
    );
  }
 
  get error$(){
    const error$ = actions$.whereType(this.TODOS_ERROR);
    return merge(
      error$.pipe(pluck('payload')),
      error$.pipe(delay(2000), mapTo(''))
    );
  }
  all() {
    this.setSearchCategory(SearchCategory.all)
  }

  active(){
    this.setSearchCategory(SearchCategory.active)
  }

  completed() {
    this.setSearchCategory(SearchCategory.completed)
  }

  private setSearchCategory(searchCategory:SearchCategory){
    this.emit({searchCategory})
  }

  loadTodos(){
   this.callApi(this.api.fetch("/todos"), todos=>{
    this.emit({todos});
   });
  }
  addTodo(todoItem:Todo){
    this.callApi(this.api.add("/todos", todoItem), todo=>{
      this.emit({todos:[...this.state.todos, todo]});
     });
  }
  
  updateTodo(todo:Todo){
    this.callApi(this.api.update("/todos", todo), updatedtodo=>{
      this.emit({ todos:this.state.todos.reduce((acc: Todo[], todo) => {
        acc.push(todo.id === updatedtodo.id ? updatedtodo : todo);
        return acc;
      }, [])});
     });
  }
  removeTodo(todo:Todo){
    this.callApi(this.api.remove("/todos/"+todo.id), id=>{
      this.emit({todos:this.state.todos.filter(t=>t.id!==id)});
     });
  }

  callApi<T>(stream: Observable<T>,resCallback: (data: T) => void): void {
    dispatch(this.SPINING_START)
    stream.subscribe(
      res =>{
        resCallback(res)
        dispatch(this.SPINING_END)
      },
      errors =>dispatch(this.TODOS_ERROR, errors.error),
      () => console.info("done")
    );
}

}
