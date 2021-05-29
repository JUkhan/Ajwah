import React, { useState, useEffect } from 'react';
import { Observable } from 'rxjs'
import logo from './logo.svg';
import './App.css';
import { Get, RemoveController } from 'ajwah-store';
import { CounterState } from './counterState';

function useStream<S>(stream$: Observable<S>, initialData: S): S {
  const [data, setData] = useState<S>(initialData);
  useEffect(() => {
    const sub = stream$.subscribe(res => setData(res));
    return () => sub.unsubscribe();
  }, []);
  return data;
}



function App() {

  const csCtrl = Get(CounterState);

  const data = useStream(csCtrl.stream$, csCtrl.state);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => csCtrl.inc()}>+</button>
        <button onClick={() => csCtrl.dispatch('asyncInc')}>Async+</button>
        <p>
          data: {data}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
