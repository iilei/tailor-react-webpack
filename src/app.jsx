import { Component } from 'react';
import moment from 'moment-timezone';

import './app.scss';

class App extends Component {
  componentWillMount() {
    window.moment = moment;
  }
  render() {
    return (
      <div>
        <h1>FOOOOOO</h1>
      </div>
    );
  }
}

export default App;
