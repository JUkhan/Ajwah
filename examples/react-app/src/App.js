import React, { PureComponent } from 'react';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

//import Page1 from './pages/page1';
import Page1 from './pages/fxPage1';
//import Page2 from './pages/page2';
import Page2 from './pages/fxPage2';
import Page3 from './pages/page3';
import { store } from 'ajwah-store';

class App extends PureComponent {

  componentWillMount() {
    /*storeCtx().exportState().subscribe(([action, state]) => {

      console.log(action, state);
      if (action.type === '@@INIT') {
        const data = sessionStorage.getItem('appState')
        data && storeCtx().importState(JSON.parse(data))
      }
      else {
        state.todo = undefined;
        sessionStorage.setItem('appState', JSON.stringify(state))
      }
    });*/
  }

  componentWillUnmount() {
    store().dispose();
  }
  render(props) {
    console.log('root-component');
    return (
      <Router>
        <React.Fragment>
          <nav className="navbar navbar-expand-sm bg-light">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Page1</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/page2/">Page2</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/page3/">Page3</Link>
              </li>
            </ul>
          </nav>
          <Route path="/" exact component={Page1} />
          <Route path="/page2/" component={Page2} />
          <Route path="/page3/" component={Page3} />
        </React.Fragment>
      </Router>
    );

  }
}

export default App;
