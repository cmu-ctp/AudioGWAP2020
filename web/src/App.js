import React from 'react';
import './css/App.css';
import SideBar from './sidebar';
import { Switch, Route } from 'react-router-dom';
import Create from './create'
import MyEvent from "./myevent";
import Edit from "./edit"
import Statistics from "./stat"
import { CONFIG } from './config/config';

const init = {
  method: 'GET',
  credentials: 'include', // cookies,
  mode: 'cors'
};

class AppBody extends React.Component {
  render() {
      let size = "S";
      if (window.screen.width > 1500) {
        size = "L";
      }
      return (
            <div className="Background">
              <SideBar userName={this.props.userName} pic={this.props.picURL} handleSignout={this.props.handleSignout}  handleClick={this.props.handleClick}/>
              <div className={"AppBody"+size} >
                <Switch>
                  <Route exact path='/' component={() => <MyEvent editClick={this.props.handleClick} name={this.props.userName}/>}/>
                  <Route path='/statistics' component={Statistics}/>
                  <Route path='/create' component={Create}/>
                  <Route path='/edit' component={Edit}/>
                </Switch>
              </div>
            </div>
      );
    }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAuth : false,
      userName : "",
      picURL : "",
      route : ""
    };
  };
  handleClick = () =>  {
    let current = window.location.pathname;
    console.log('Click');
    this.setState({
      route: current
    });
  };
  componentWillMount() {  // Strict checking of logged in user
    fetch(
        CONFIG.serverIp + CONFIG.userInfo,
        init
    )
    .then(
        res => res.json()
    )
    .then(data => {
      console.log(data);
      console.log("YES!!");
      this.setState({
        hasAuth: true,
        picURL: data.result.avatar_url,
        userName: data.result.display_name
      })
    })
    .catch( () => window.location.href = CONFIG.serverIp + CONFIG.authLogin);
  }

  handleSignout = () =>  {
    window.location.href = CONFIG.serverIp + CONFIG.authLogout;
  };

  render() {
    if (this.state.hasAuth) {
        return (
            <div className="App">
              <AppBody userName={this.state.userName} picURL={this.state.picURL} handleSignout={this.handleSignout} handleClick={this.handleClick}/>
            </div>
        );
    } else {
      return <span>Waiting</span>
    }
  }
}

export default App;
