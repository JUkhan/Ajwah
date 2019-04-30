import React, { useState, useEffect } from 'react';
//import Counter from "../components/fxCounterComponent";
import Counter from "../components/counterComponent";
//import AddTutorial from "../components/fxAddTutorialComponent";
//import TutorialList from "../components/fxTutotialListComponent";
import Todos from "../components/Todos";
import AddTodo from "../components/AddTodo";
import { dispatch } from 'ajwah-store';
import { useSubscriptions } from 'react-ajwah';
import { LOAD_TODOS } from '../states/actions'

function page1() {

    const { counter, todo } = useSubscriptions(['counter', 'todo'])
    console.log(counter, todo);
    useEffect(() => {
        dispatch(LOAD_TODOS)

    }, [])


    console.log('fx-page1');

    return <div>
        <Counter counter={counter} />
        <header className="header">Todo List <b>{todo.message}</b></header>
        <AddTodo />
        <Todos todos={todo.data} />
    </div>


}

export default page1;

