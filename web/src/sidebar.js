import React from "react";
import './css/sidebar.css'
import { Link } from 'react-router-dom'

class NavItemCreate extends React.Component {
    render() {
        let path = window.location.pathname;
        if (path === "/create" || path.substring(0,5) === "/edit") {
            return (
                <div className="Selected">
                    <div className="CreateSelected">

                    </div>
                </div>
            );
        } else if (path === "/") {
            return (
                <div className="CreateNotSelected">
                    <Link className= "Link" to='/create' onClick={this.props.handleClick}>

                    </Link>
                </div>
            );
        } else {
            return (
                <span>Error!</span>
            );
        }
    }
}

class NavItemEvent extends React.Component {

    render() {
        let path = window.location.pathname;
        if (path === "/") {
            return (
                <div className="Selected">
                    <div className="EventSelected">

                    </div>
                </div>
            );
        } else if (path === "/create" || path.substring(0,5) === "/edit") {
            return (
                <div className="EventNotSelected">
                    <Link className= "Link" to='/' onClick={this.props.handleClick}>

                    </Link>
                </div>
            );
        } else {
            return (
                <span>Error!</span>
            );
        }
    }
}

class SideBar extends React.Component {
    render() {
        let size = 0;
        if (window.screen.width < 1500) {
            size = 250;
        } else if (window.screen.width < 2000) {
            size = 300;
        } else {
            size = 400;
        }
        if (window.location.pathname.substring(0,11) !== "/statistics") {
            return (
                <div className={"Bar"+size}>
                    <div className="UserContent">
                        <div className="Picture">
                            <img src={this.props.pic} alt="placeholder"/>
                        </div>
                        <span>{this.props.userName}</span>
                        <div className="Signout" onClick={this.props.handleSignout} />
                    </div>
                    <div className="CreateEvent">
                        <NavItemCreate handleClick={this.props.handleClick} />
                    </div>
                    <div className="MyEvent">
                        <NavItemEvent handleClick={this.props.handleClick} />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="NoBar" />
            );
        }

    }
}

export default SideBar;