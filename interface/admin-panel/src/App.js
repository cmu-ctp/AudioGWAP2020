import React from 'react';
import { Tabs } from "@feuer/react-tabs";
//import logo from './logo.svg';
import './App.css';
import { CONFIG } from './config/config'
import TestButton from './testButton'

import Button from "react-bootstrap/Button";

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
    /*const reqBody = {
      useInGame: true
    }*/
    let testInit = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    }
    if (this.state.role > 0) {
      return (

        <div className="App">
          {/* eslint-disable-next-line */}
          <div className="nav-container">
            <div className="nav-wrapper">
              <nav className="nav-content">
                <div className="logo">Polyphonic</div>
                <ul className="nav-items">
                  <li><a href="http://localhost:5000/">Home</a></li>
                  <li><a href="http://localhost:5000/dataset">Dataset</a></li>
                  <li><a href="http://localhost:5000/people">People</a></li>
                  <li><a className="nav-btn-container" href="#">
                  <img className="search-btn" src="/search.png " alt="search icon"/></a></li>
                </ul>
                <div className="user-info">
                  <img className="user-avatar" src={this.state.picURL} alt="Profile Picture"/>
                  <p>{this.state.userName}</p>
                  <a href={CONFIG.serverIp + CONFIG.authLogout}>
                    <button className="sign-out">Sign Out</button>
                    </a>
                </div>
              </nav>
            </div>
          </div>
          <div className="body-container">
            <div className="tab-bar">
              <Tabs
                  tabsProps={{
                    style: {

                      textAlign: "left"
                    }
                  }}
                  activeTab={{
                    id: "tab2"
                  }}
              >
                <Tabs.Tab id="tab1" title="Dashboard">
                  <div style={{ padding: 30 }}>This is tab 1</div>
                </Tabs.Tab>
                <Tabs.Tab id="tab2" title="Category">
                  <div style={{ padding: 30 }}>
                    <form action="/api/admin/categories" method="post">
                      <div className="edit-category">
                        <p>Add New Category</p>
                        <label htmlFor="sub">Subcategory:</label>
                        <input className="edit-input" type="text" id="sub" name="sub"/>
                        <label htmlFor="parent">Parent Category:</label>
                        <input className="edit-input" type="text" id="parent" name="parent"/>
                        <div className="edit-buttons">
                          <input type="Submit" value="Add Category"/>
                          <input type="Submit" value="Delete"/>
                        </div>
                      </div>
                    </form>
                    <TestButton url={CONFIG.serverIp + '/admin/sounds/review'} init={testInit}/>
                  </div>
                </Tabs.Tab>
                <Tabs.Tab id="tab3" title="Validation">
                  <div style={{ padding: 30 }}>This is tab 3</div>
                </Tabs.Tab>
              </Tabs>
            </div>
          </div>
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
