import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { Layout } from './layout';

function App() {

  return (
    <div className="theme-bootstrap">
      <Router>
        <Layout />
      </Router>
    </div>
  );
}

export default App;


