import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App.js'
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'
ReactDOM.render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
), document.getElementById('root'));


//ReactDOM.render(<SideBar />, document.getElementById('sideBar'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
