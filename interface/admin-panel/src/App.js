import React from 'react';
//import logo from './logo.svg';
import './App.css';
import { CONFIG } from './config/config'

const init = {
  method: 'GET',
  credentials: 'include', // cookies,
  mode: 'cors'
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
        hasAuth: true,
        picURL: data.result.avatar_url,
        userName: data.result.display_name
      });
    })
    .catch( () => window.location.href = CONFIG.serverIp + CONFIG.authLogin );
  }

  render() {
    console.log(this.state)
    if (this.state.hasAuth) {
      return (
        <div className="App">
          <img src={this.state.picURL} alt="Profile Picture"/>
          <p>{this.state.userName}</p>
          <a href={CONFIG.serverIp + CONFIG.authLogout}>Sign Out</a>
        </div>
      )
    } else {
      return (
        <span>Waiting</span>
        )
    }
  }
}

export default App;
