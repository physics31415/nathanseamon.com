import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import './index.css';
import App from './App';
import Resume from './Components/Resume'
import About from './Components/About'
import ServiceHistoryDashboard from './Components/CarServiceHistoryDashboard.js'
import CreateAccount from './Components/CreateAccount.js'
import * as serviceWorker from './serviceWorker'

const routing = (
  <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/resume" component={Resume} />
      <Route path="/about" component={About} />
      <Route path="/serviceDashboard" component={ServiceHistoryDashboard} />
      <Route path="/createAccount" component={CreateAccount} />
    </div>
  </Router>
)


ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
