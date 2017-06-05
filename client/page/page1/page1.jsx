import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';

require('./page1.less');
const img = require('../../img/react-logo.png');


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { stateX: 'Is state X' };
  }
  componentDidMount() {
    console.log('componentDidAmount');
  }
  render() {
    return (
      <div>
        <h2>{this.state.stateX}</h2>
        <h3>My name is {this.props.name}</h3>
        <ul>
          <li><Link to={'/page1'}>link to home</Link></li>
          <li><Link to="/page1/about">link to about</Link></li>
        </ul>
        {this.props.children}
        <div>
          <img className="img-test" src={img} alt="img test" />
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  name: 'Zac',
  children: '<div>App Page</div>'
};

App.propTypes = {
  children: PropTypes.element.isRequired,
  name: PropTypes.string
};

const Home = () => (
  <div>Home Page</div>
);

const About = () => (
  <div>About Page</div>
);

const NoMatch = () => (
  <h2 style={{ fontWeight: 'bolder' }}>404 Page not found</h2>
);

render(
  <Router history={browserHistory}>
    <Route path="/page1" component={App}>
      <IndexRoute component={Home} />
      <Route path="/page1/about" component={About} />
      <Route path="*" component={NoMatch} />
    </Route>
  </Router>,
  document.getElementById('example')
);

