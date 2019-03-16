import React, { PureComponent } from 'react';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Page1 from './pages/page1';
import Page2 from './pages/page2';
import { getStore } from 'ajwah-react-store';

class App extends PureComponent {

  componentWillUnmount() {
    getStore().dispose();
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
            </ul>
          </nav>
          <Route path="/" exact component={Page1} />
          <Route path="/page2/" component={Page2} />
        </React.Fragment>
      </Router>
    );

  }
}

export default App;
