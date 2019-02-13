import React from 'react';
import {render} from 'react-dom';
import './../scss/main.scss';

import TodoList from './components/TodoList.jsx';


class App extends React.Component {
  render () {
    return (
      <div className="todo">
        <TodoList />
      </div>
    );
  }
}

render(<App />, document.querySelector('#app'));
