import { CounterComponent } from './components/counter/counter.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path:'', component: CounterComponent},
  { path: 'todos', loadChildren: () => import('./components/todos/todos.module').then(m => m.TodosModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
