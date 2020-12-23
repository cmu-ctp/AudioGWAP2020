import React from 'react';
//import logo from './logo.svg';
import './App.css';

// This component is a button where, upon clicking it, runs a fetch command
// to its url prop using its init prop as the options. It prints the response
// in a textbox underneath it.

class TestButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { resObj: {} };

    //to make this work in callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    fetch(this.props.url, this.props.init)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({ resObj: data });
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>
          Do Something
        </button>
        <pre style={{textAlign: 'left'}}>
          {JSON.stringify(this.state.resObj, undefined, 2)}
        </pre>
      </div>
    )
  }
}

export default TestButton;