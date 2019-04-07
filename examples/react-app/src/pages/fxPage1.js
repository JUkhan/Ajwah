import React, { useState, useEffect } from 'react';
import Counter from "../components/fxCounterComponent";
//import AddTutorial from "../components/fxAddTutorialComponent";
//import TutorialList from "../components/fxTutotialListComponent";
import Todos from "../components/Todos";
import AddTodo from "../components/AddTodo";
import { getStore } from 'ajwah-store';
import { LOAD_TODOS } from '../states/actions'

function page1() {
    const store = getStore();
    const [counter, setCounter] = useState({});
    const [todo, setTodo] = useState({});

    useEffect(() => {
        const subscription = store.select('counter').subscribe(res => setCounter(res))
        subscription.add(store.select('todo').subscribe(res => setTodo(res)));
        store.dispatch({ type: LOAD_TODOS });
        return () => subscription.unsubscribe();
    }, []);


    console.log('fx-page1');

    return <div>
        <Counter counter={counter} />
        <header className="header">Todo List <b>{todo.message}</b></header>
        <AddTodo />
        <Todos todos={todo.data} />
    </div>


}

export default page1;

