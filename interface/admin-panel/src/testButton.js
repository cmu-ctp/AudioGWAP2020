import React from 'react';
//import logo from './logo.svg';
import './App.css';

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