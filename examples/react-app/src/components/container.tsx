import React, { Component } from 'react';

import Signup from './signup';
import Login from './login';

interface AppProps { }
interface AppState {
  name: string;
  isLogin:boolean
}

export class LRContainer extends Component<AppProps, AppState> {
  constructor(props:any) {
    super(props);
    this.state = {
      name: 'React',
      isLogin:false
    };
  }
  isLogin(flag:boolean){
    this.setState({isLogin:flag})
  }
  render() {
    return (
      <div>
      <button onClick={e=>this.isLogin(false)}>Signup Form</button>
      <button onClick={e=>this.isLogin(true)}>Login Form</button>
      {this.state.isLogin? <Login/> : <Signup />}
      
     </div>
    );
  }
}


