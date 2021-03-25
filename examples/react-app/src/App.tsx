import React from 'react';
import './App.css';
import Cascading from './components/cascading';

import { LRContainer } from './components/container';
import { GroupingForm } from './components/billing';
import { Msn } from './components/msn';
import { NewCounter } from './components/counter';
import Todos from './todo/components/todos'

//import { RxForm, Field, Group, required, min, max, minLength, maxLength } from 'ajwah-reactive-form';
function App() {
  return (
    <div className="app">

      <NewCounter />
      {/* <Cascading />
      <LRContainer />
      <GroupingForm />
      <Msn />
      <Todos /> */}
      <Todos />
    </div>
  );
}

export default App;
/*
Dear Sir,

We have received an inward remittance of USD 2,458.00 from “ZITELAB APS, SOLSORTEVEJ 44”
favouring your account with us. Hence, requesting you to provide us
the below listed documents to execute the payment.



Required Documents:

1.      Copy of agreement with your remitter
2.      Declaration Form (attached)
3.      Invoice copy/ claim copy (if any)
4.      VISA & Passport copy (if the workstation out of country)
*/