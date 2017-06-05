import { Router, Route, Link, browserHistory } from 'react-router';
import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';

require('./page1.less');
const img = require('../../img/react-logo.png');

const App = props => (
  <div>
    <ul>
      <li><Link to={'/'}>link to app</Link></li>
      <li><Link to="/test/about">link to about</Link></li>
    </ul>
    {props.children || <div>App Page</div>}
    <div>
      <img className="img-test" src={img} alt="img test" />
    </div>
  </div>
);

App.propTypes = {
  children: PropTypes.element
};

const About = () => {
  console.log('page1ssss');
  return (<div>About Page</div>);
};

const NoMatch = () => (
  <h2 style={{ fontWeight: 'bolder' }}>404 Page not fosssund</h2>
);

render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="about2" component={About} />
      <Route path="*" component={NoMatch} />
    </Route>
  </Router>,
  document.getElementById('example2')
);
