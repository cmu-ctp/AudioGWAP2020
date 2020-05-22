import React from "react";
import './css/stat.css';
import ReactWordcloud from 'react-wordcloud';
import { CONFIG } from "./config/config";


const NumMap = ["../img/4.png","../img/5.png","../img/6.png","../img/7.png","../img/8.png","../img/9.png","../img/10.png"];
// const words = [
//     {
//         "text": "ACD",
//         "value": 300
//     },
//     {
//         "text": "NB",
//         "value": 300
//     },
//     {
//         "text": "QS3W",
//         "value": 300
//     },
//     {
//         "text": "POrI",
//         "value": 300
//     },
//     {
//         "text": "YyUI",
//         "value": 300
//     },
//     {
//         "text": "PQ2M",
//         "value": 300
//     },
//     {
//         "text": "P3QM",
//         "value": 300
//     },
//     {
//         "text": "P2QM",
//         "value": 300
//     },
//     {
//         "text": "P55QM",
//         "value": 500
//     },
//     {
//         "text": "P4QM",
//         "value": 100
//     },
//     {
//         "text": "PQvM",
//         "value": 500
//     },
//     {
//         "text": "PcQM",
//         "value": 200
//     },
//     {
//         "text": "PdQM",
//         "value": 300
//     },
//     {
//         "text": "PQaaM",
//         "value": 300
//     },
//     {
//         "text": "PQsM",
//         "value": 300
//     },
//     {
//         "text": "PQ3M",
//         "value": 300
//     },
//     {
//         "text": "PQ2M",
//         "value": 300
//     },
//     {
//         "text": "PQ1M",
//         "value": 300
//     },
//     {
//         "text": "PQsM",
//         "value": 300
//     },
// ];


class TopCol extends React.Component {
    render() {
        if (this.props.id + 1 > this.props.data.length) {
            return (
                <div className={"ColPic" + this.props.id}>
                    <div className={"SoundNum" + this.props.id}>
                        <div className="SoundNumPic">

                        </div>
                        <span className="SoundNum"> </span>
                    </div>
                    <TopInfo id={this.props.id} data={this.props.data}/>
                </div>
            );
        } else if (this.props.step >= 3 - this.props.id) {
            return (
                <div className={"ColPic" + this.props.id}>
                    <div className={"SoundNum" + this.props.id}>
                        <div className="SoundNumPic">
                            <img className="SoundPic" alt="SoundNumPic" src="../img/soundlabel.png"/>
                        </div>
                        <span className="SoundNum">{this.props.data[this.props.id].sound_count}</span>
                    </div>
                    <TopInfo id={this.props.id} data={this.props.data}/>
                </div>
            );
        } else {
            return (
                <div className={"ColPic" + this.props.id}>
                    <div className={"SoundNum" + this.props.id}>

                    </div>
                </div>
            );
        }
    }
}

class TopInfo extends React.Component {
    render() {
        if (this.props.id + 1 > this.props.data.length) {
            return (
                <div className={"TopEmpty"} />
            );
        } else if (this.props.id === 0) {
            return (
                <div className={"TopEffect"+this.props.id}>
                    <div className={"TopName"+this.props.id} >
                        <span>{this.props.data[this.props.id].user.user_name}</span>
                    </div>
                    <div className={"CirclePic"}>
                        <img src={this.props.data[this.props.id].user.avatar_url} alt={"UserPic"} className={"UserPic"}/>
                    </div>
                    <img src={"../img/crown.png"} alt={"Crown"} className={"Crown"} />
                </div>
            );
        } else {
            return (
                <div className={"TopEffect"+this.props.id}>
                    <div className={"TopName"+this.props.id} >
                        <span>{this.props.data[this.props.id].user.user_name}</span>
                    </div>
                    <div className={"CirclePic"}>
                        <img src={this.props.data[this.props.id].user.avatar_url} alt={"UserPic"} className={"UserPic"}/>
                    </div>
                </div>
            );
        }
    }
}

class OtherInfo extends React.Component {
    render() {
        if (this.props.id > this.props.data.length || this.props.step !== 4) {
            return (
                <div className="OtherContent">
                    <div className={"OtherCircle"}>
                        <img src={"/img/circle.png"} alt={"UserPic"} className={"UserPic"}/>
                    </div>
                    <img src={NumMap[this.props.id-4]} alt={"Rank"+this.props.id} className={"RankPic"}/>
                    <span className="OtherName"> </span>
                    <div className="OtherNum"> </div>
                </div>
            )
        } else {
            return (
                <div className="OtherContent">
                    <div className={"OtherCircle"}>
                        <img src={this.props.data[this.props.id-1].user.avatar_url} alt={"UserPic"} className={"UserPic"}/>
                    </div>
                    <img src={NumMap[this.props.id-4]} alt={"Rank"+this.props.id} className={"RankPic"}/>
                    <span className="OtherName">{this.props.data[this.props.id-1].user.user_name}</span>
                    <div className="OtherNum"><span>{this.props.data[this.props.id-1].sound_count}</span></div>
                </div>
            );
        }

    }
}

class Statistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            page: 0,
            loading: true,
            data: [],
            cloudData: []
        };
    }

    componentWillMount() {
        let init = {
            method: 'GET',
            credentials: 'include', // cookies,
            mode: 'cors'
        };
        let id = window.location.pathname.substr(12);
        fetch(
            CONFIG.serverIp + CONFIG.streamerEvents + "/" + id + CONFIG.userStats,
            //'https://echoes.etc.cmu.edu/api/streamer/events/fake/stat/users',
            init
        )
        .then(
            res => res.json()
        )
        .then(data => {
            this.setState({
                data: data.result
            });
        })
        .catch( () => window.location.href = CONFIG.serverIp + CONFIG.authLogin);

        fetch(
            CONFIG.serverIp + CONFIG.streamerEvents + "/" + id + CONFIG.statCategories,
            init
        )
        .then(
            res => res.json()
        )
        .then(data => {
            this.setState({
                loading: false,
                cloudData: data.result
            });
        })
        .catch( () => window.location.href = CONFIG.serverIp + CONFIG.authLogin);
    }

    handleClick = () => {
        if (this.state.step < 4) {
            this.setState({
                    step: this.state.step + 1,
                }
            );
        }
    };

    backClick = () => {
        if (this.state.page === 0) {
            window.location.pathname =  "/";
        } else {
            this.setState({
                page: this.state.page - 1,
            });
        }
    };

    nextClick = () => {
        this.setState({
            page: this.state.page + 1,
        });
    };



    render() {
        if (this.state.loading) {
            return (
                <span>Waiting</span>
            );
        } else if (this.state.page === 0) {
            return (
                <div className="StatBackground">
                    <div className="UpButton" onClick={this.backClick}>
                        <img src={"../img/back.png"} alt={"BackButton"} />
                    </div>
                    <div className="BackgroundImg">
                        <img className="TitleImg" src="../img/stat_title_1.png" alt="Title"/>
                        <div className="RankBody">
                            <div className="Top3">
                                <div className="Col" onClick={this.handleClick}>
                                    <TopCol id={2} step={this.state.step} data={this.state.data}/>
                                </div>
                                <div className="Col" onClick={this.handleClick}>
                                    <TopCol id={0} step={this.state.step} data={this.state.data}/>
                                </div>
                                <div className="Col" onClick={this.handleClick}>
                                    <TopCol id={1} step={this.state.step} data={this.state.data}/>
                                </div>
                            </div>
                            <div className="Other" onClick={this.handleClick}>
                                <div className="OtherTitle">

                                </div>
                                <OtherInfo id={4} data={this.state.data} step={this.state.step}/>
                                <OtherInfo id={5} data={this.state.data} step={this.state.step}/>
                                <OtherInfo id={6} data={this.state.data} step={this.state.step}/>
                                <OtherInfo id={7} data={this.state.data} step={this.state.step}/>
                                <OtherInfo id={8} data={this.state.data} step={this.state.step}/>
                                <OtherInfo id={9} data={this.state.data} step={this.state.step}/>
                                <OtherInfo id={10} data={this.state.data} step={this.state.step}/>
                            </div>
                        </div>
                    </div>
                    <div className="BotButton" onClick={this.nextClick}>
                        <img src={"../img/more.png"} alt={"NextButton"} />
                    </div>
                </div>
            );
        } else {
            let words = [];
            for (let i = 0; i < this.state.cloudData.length; i+=1) {
                let obj = {
                    "text": this.state.cloudData[i].category,
                    "value": this.state.cloudData[i].sound_count
                };
                words.push(obj);
            }
            let first1 = "", second1 = "", third1 = "", first2 = "", second2 = "", third2 = "";
            if (this.state.cloudData.length > 0) {
                first1 = "1. " + this.state.cloudData[0].category;
                first2 = this.state.cloudData[0].sound_count;
            }
            if (this.state.cloudData.length > 1) {
                second1 = "2. " + this.state.cloudData[1].category;
                second2 = this.state.cloudData[1].sound_count;
            }
            if (this.state.cloudData.length > 2) {
                third1 = "3. " + this.state.cloudData[2].category;
                third2 = this.state.cloudData[2].sound_count;
            }
            return (
                <div className="StatBackground">
                    <div className="UpButton" onClick={this.backClick}>
                        <img src={"../img/back.png"} alt={"BackButton"} />
                    </div>
                    <div className="CloudBackgroundImg">
                        <div className="CloudLeft">
                            <ReactWordcloud words={words} />
                        </div>
                        <div className="CloudRight">
                            <div className="RightBar">
                                <img src={"../img/crown.png"} alt={"Crown"} className={"RightCrown"}/>
                                <span>Community Favourite Sounds:</span>
                            </div>
                            <span className={"RightSpan"}>{first1 + " " + first2}</span>
                            <span className={"RightSpan"}>{second1 + " " + second2}</span>
                            <span className={"RightSpan"}>{third1 + " " + third2}</span>
                        </div>
                    </div>
                    <div className="BotButton" >

                    </div>
                </div>
            );
        }

    }
}

export default Statistics;