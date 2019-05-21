import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home.components';



const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'jtodo',
        loadChildren: './features/todo/todo.module#TodoModule'
    },
    {
        path: 'tutorial',
        loadChildren: './features/tutorial/tutorial.module#TutorialModule'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
