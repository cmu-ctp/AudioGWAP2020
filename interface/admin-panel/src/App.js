import React from 'react';
//import logo from './logo.svg';
import './App.css';
import { CONFIG } from './config/config'
import TestButton from './testButton'

const init = {
  method: 'GET',
  credentials: 'include', // cookies,
  mode: 'cors'
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: 0,
      hasAuth: false,
      userName: "",
      picURL: "",
    }
  }
  componentDidMount() {
    fetch(
      CONFIG.serverIp + CONFIG.userInfo,
      init
    )
    .then(
      res => res.json()
    )
    .then(data => {
      console.log(data);
      this.setState({
        role: data.result.role || 0,
        hasAuth: true,
        picURL: data.result.avatar_url,
        userName: data.result.display_name
      });
    })
    .catch( () => window.location.href = CONFIG.serverIp + CONFIG.authLogin );
  }

  render() {
    console.log(this.state)
    const reqBody = {
      category: 'Cooking'
    }
    let testInit = {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    }
    if (this.state.role > 0) {
      return (
        <div className="App">
          {/* eslint-disable-next-line */}
          <img src={this.state.picURL} alt="Profile Picture"/>
          <p>{this.state.userName}</p>
          <a href={CONFIG.serverIp + CONFIG.authLogout}>Sign Out</a>
          <form action="/api/admin/categories" method="post">
            <label for="parent">Parent Category:</label>
            <input type="text" id="parent" name="parent"/>
            <label for="sub">Subcategory:</label>
            <input type="text" id="sub" name="sub"/>
            <input type="Submit" value="Add Category"/>
          </form>
          <TestButton url={CONFIG.serverIp + '/admin/sounds/5f34c215e3bde40bcc73a266'} init={testInit}/>
        </div>
      )
    } else if (this.state.hasAuth) {
      return (
        <span>
          Sorry, you don't have permission to access this. If you believe this is an error,
          please let us know.
        </span>
        )
    } else {
      return (
        <span>Waiting</span>
      )
    }
  }
}

export default App;
