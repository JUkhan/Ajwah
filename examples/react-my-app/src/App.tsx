import React from 'react';
import Todos from './components/todos';
import './App.css';
import Counter from './counterModule/counter';
function App() {
  return (
    <React.Fragment>
    <Todos></Todos>
    <Counter/>
    </React.Fragment>
  );
}

export default App;