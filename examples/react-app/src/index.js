import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { setStoreContext } from 'ajwah-react-store'
import CounterEffect from "./states/counterEffects";
import TutorialState from "./states/tutoroalState";
import CounterSate from "./states/counterState";
//import { devTools } from './devTools/devTools';


setStoreContext({
    states: [CounterSate, TutorialState],
    effects: [CounterEffect],
    //devTools: devTools({ maxAge: 10 })
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
