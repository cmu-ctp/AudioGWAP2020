import React from "react";
import './css/myevent.css'
import Panel from "./common";
import {Link} from "react-router-dom";
import Popup from "reactjs-popup";
import { CONFIG } from "./config/config";

class EventButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code : ""
        };
        let init = {
            method: 'GET',
            credentials: 'include', // cookies,
            mode: 'cors'
        };
        let apiUrl = CONFIG.serverIp + CONFIG.streamerEvents + "/" + this.props.eventId + "/token";
        fetch(
            apiUrl,
            init
        )
            .then(res => res.json())
            .then(data => {
                if (data.failed) {
                    throw new Error(data.msg || "Internal Error");
                }
                this.setState({
                    code: data.result
                });
            })
            .catch( e => alert(e));
    }

    render() {
        let editLink = "/edit/" + this.props.eventId;
        let statLink = "/statistics/" + this.props.eventId;
        return (
            <div className="Buttons">
                <Link className= "EventLink" to={editLink}>
                    <button className="Edit" onClick={this.props.editClick}>
                        <span>Edit Event</span>
                    </button>
                </Link>
                <Link className= "EventLink" to={statLink}>
                    <button className="View" onClick={this.props.editClick}>
                        <span>View Stat</span>
                    </button>
                </Link>

                <Popup trigger={<button className="Start">
                    <span>Start Game</span>
                </button>} modal
                       closeOnDocumentClick>
                    <div>{"Your Game Code is " + this.state.code}</div>
                </Popup>
            </div>
        );
    }
}

class EventEntry extends React.Component {
    render() {
        if (this.props.num >= this.props.val.length) {
            return (
                <div className="Event" />
            )
        } else {
            let time = new Date(this.props.val[this.props.num].time);
            let hour = time.getHours().toString();
            if (time.getHours() < 10) {
                hour = "0" + time.getHours().toString();
            }
            let minutes = time.getMinutes().toString();
            if (time.getMinutes() < 10) {
                minutes = "0" + time.getMinutes().toString();
            }
            let timeStr = time.getFullYear().toString() + "-" + (time.getMonth()+1).toString() + "-" + time.getDate().toString()
                + " " + hour + ":" + minutes;
            return (
                <div className="Event">
                    <div className="EventCard">
                        <div className="EventPic">
                            <div className="EventTitle">
                                <span>{"Title: " + this.props.val[this.props.num].title}</span>
                            </div>
                        </div>
                        <div className="Host">
                            <span>{"Host: "+this.props.name}</span>
                            <br/>
                            <span>{"Time: " + timeStr}</span>
                        </div>
                    </div>
                    <EventButton eventId={this.props.val[this.props.num].id} editClick={this.props.editClick}/>
                </div>
            )
        }
    }
}

class PastEntry extends React.Component {
    render() {
        if (this.props.num >= this.props.val.length) {
            return (
                <div className="EventPast" />
            )
        } else {
            let time = new Date(this.props.val[this.props.num].time);
            let hour = time.getHours().toString();
            if (time.getHours() < 10) {
                hour = "0" + time.getHours().toString();
            }
            let minutes = time.getMinutes().toString();
            if (time.getMinutes() < 10) {
                minutes = "0" + time.getMinutes().toString();
            }
            let timeStr = time.getFullYear().toString() + "-" + (time.getMonth()+1).toString() + "-" + time.getDate().toString()
                + " " + hour + ":" + minutes;
            return (
                <div className="EventPast">
                    <div className="EventCard">
                        <div className="EventPic">
                            <div className="EventTitle">
                                <span>{"Title: " + this.props.val[this.props.num].title}</span>
                            </div>
                        </div>
                        <div className="Host">
                            <span>{"Host: "+this.props.name}</span>
                            <br/>
                            <span>{"Time: " + timeStr}</span>
                        </div>
                    </div>
                    <Link className= "EventLinkPast" to={"/statistics/"+this.props.val[this.props.num].id}>
                        <button className="View" onClick={this.props.editClick}>
                            <span>Statistics</span>
                        </button>
                    </Link>
                </div>
            )
        }
    }
}

class UpComing extends React.Component {
    render() {
        if (this.props.pageMax <= 1) {
            return (
                <div className="UpcomingEvents">
                    <div className="NoPageLeft" />
                    <EventEntry num={this.props.page*2} val={this.props.upcomingEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <EventEntry num={this.props.page*2+1} val={this.props.upcomingEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <div className="NoPageRight" />
                </div>
            );
        } else if (this.props.page === 0) {
            return (
                <div className="UpcomingEvents">
                    <div className="NoPageLeft" />
                    <EventEntry num={this.props.page*2} val={this.props.upcomingEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <EventEntry num={this.props.page*2+1} val={this.props.upcomingEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <div className="PageRight" onClick={this.props.handleRight} />
                </div>
            );
        } else if (this.props.page === this.props.pageMax - 1) {
            return (
                <div className="UpcomingEvents">
                    <div className="PageLeft" onClick={this.props.handleLeft} />
                    <EventEntry num={this.props.page*2} val={this.props.upcomingEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <EventEntry num={this.props.page*2+1} val={this.props.upcomingEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <div className="NoPageRight" />
                </div>
            );
        } else {
            return (
                <div className="UpcomingEvents">
                    <div className="PageLeft" onClick={this.props.handleLeft} />
                    <EventEntry num={this.props.page*2} val={this.props.upcomingEventList} editClick={this.props.editClick}/>
                    <EventEntry num={this.props.page*2+1} val={this.props.upcomingEventList} editClick={this.props.editClick}/>
                    <div className="PageRight" onClick={this.props.handleRight} />
                </div>
            );
        }
    }
}

class Past extends React.Component {
    render() {
        if (this.props.pageMax <= 1) {
            return (
                <div className="PastEvents">
                    <div className="NoPageLeft" />
                    <PastEntry num={this.props.page*3} val={this.props.pastEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <PastEntry num={this.props.page*3+1} val={this.props.pastEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <PastEntry num={this.props.page*3+2} val={this.props.pastEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <div className="NoPageRight" />
                </div>
            );
        } else if (this.props.page === 0) {
            return (
                <div className="PastEvents">
                    <div className="NoPageLeft" />
                    <PastEntry num={this.props.page*3} val={this.props.pastEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <PastEntry num={this.props.page*3+1} val={this.props.pastEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <PastEntry num={this.props.page*3+2} val={this.props.pastEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <div className="PageRight" onClick={this.props.handleRight} />
                </div>
            );
        } else if (this.props.page === this.props.pageMax - 1) {
            return (
                <div className="PastEvents">
                    <div className="PageLeft" onClick={this.props.handleLeft} />
                    <PastEntry num={this.props.page*3} val={this.props.pastEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <PastEntry num={this.props.page*3+1} val={this.props.pastEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <PastEntry num={this.props.page*3+2} val={this.props.pastEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <div className="NoPageRight" />
                </div>
            );
        } else {
            return (
                <div className="PastEvents">
                    <div className="PageLeft" onClick={this.props.handleLeft} />
                    <PastEntry num={this.props.page*3} val={this.props.pastEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <PastEntry num={this.props.page*3+1} val={this.props.pastEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <PastEntry num={this.props.page*3+2} val={this.props.pastEventList} name={this.props.name} editClick={this.props.editClick}/>
                    <div className="PageRight" onClick={this.props.handleRight} />
                </div>
            );
        }
    }
}

class MyEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            upcomingEventList: [],
            pastEventList: [],
            page: 0,
            pageMax: 0,
            pastPage: 0,
            pastPageMax: 0,
            finish: false
        };
        let init = {
            method: 'GET',
            credentials: 'include', // cookies,
            mode: 'cors'
        };
        fetch(
            CONFIG.serverIp + CONFIG.streamerUpcomingEvents,
            init
        )
        .then(
            (res) => {
                if (!res.ok) {
                    const error = res.json() || {};
                    if (error.msg) {
                        throw new Error(error.msg);
                    } else {
                        throw new Error('Internal Error');
                    }
                }
                return res.json();
            }
        )
        .then(data => {
            let max = Math.floor(data.result.length / 2) + data.result.length % 2;
            this.setState({
                upcomingEventList: data.result,
                pageMax: max
            });
        })
        .catch( e => alert(e));

        fetch(
            CONFIG.serverIp + CONFIG.streamerPastEvents,
            init
        )
            .then(
                (res) => {
                    if (!res.ok) {
                        const error = res.json() || {};
                        if (error.msg) {
                            throw new Error(error.msg);
                        } else {
                            throw new Error('Internal Error');
                        }
                    }
                    return res.json();
                }
            )
            .then(data => {
                let max = Math.floor(data.result.length / 3);
                if (data.result.length % 3 !== 0) {
                    max ++;
                }
                this.setState({
                    pastEventList: data.result,
                    pastPageMax: max,
                    finish: true
                });
            })
            .catch( e => alert(e));
    }

    handleRight = () => {
        let currentPage = this.state.page;
        currentPage++;
        this.setState({
            page: currentPage
        })
    };

    handleLeft = () => {
        let currentPage = this.state.page;
        currentPage--;
        this.setState({
            page: currentPage
        })
    };

    handleRightPast = () => {
        let currentPage = this.state.pastPage;
        currentPage++;
        console.log("RightClick");
        this.setState({
            pastPage: currentPage
        })
    };

    handleLeftPast = () => {
        let currentPage = this.state.pastPage;
        currentPage--;
        this.setState({
            pastPage: currentPage
        })
    };

    render() {
        if (this.state.finish) {
            return (
                <div className="MyEventBody">
                    <Panel name="Upcoming" text="Upcoming Events" />
                    <UpComing page={this.state.page} pageMax={this.state.pageMax} handleLeft={this.handleLeft} handleRight={this.handleRight}
                              editClick={this.props.editClick} name={this.props.name} upcomingEventList={this.state.upcomingEventList}/>
                    <Panel name="Past" text="Past Events" />
                    <Past page={this.state.pastPage} pageMax={this.state.pastPageMax} handleLeft={this.handleLeftPast} handleRight={this.handleRightPast}
                          name={this.props.name} pastEventList={this.state.pastEventList} editClick={this.props.editClick}/>
                </div>
            );
        } else {
            return (
                <span>Waiting</span>
            )
        }
    }
}

export default MyEvent;