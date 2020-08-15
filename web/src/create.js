import React from "react";
import './css/create.css';
import Datetime from 'react-datetime';
import './css/react-datetime.css'
import Panel from "./common";
import { CONFIG } from "./config/config";

const CategoryList = ["Kitchen", "Bathroom", "Living", "Garage", "Ambience", "Concerning"];
const CategoryLen = 6;
const CategorySubList = [
    ["Sink/Faucet","Disposer","Garbage bin","Microwave","Oven","Toaster","Cooktop","Kettle","Refrigerator","Cooking","Silverwave","Plates","Mopping floor"],
    ["Sink","Bathtub","Shower","Hairdryer","Mirror cabinet","Toothbrush","Toilet flush","Toilet paper","Hand wash","Electric trimmer","Soap dispenser","Deodorant","Extractor fan"],
    ["Door","Doorbell","TV","Stereo","Children playing","Phone Ringing","Typing Keyboard","Window","Chair/Couch","Air conditioner","Vacuum cleaner","Fireplace","Clock"],
    ["Door","Car","Bike","Motorbike","Tools","Washer","Dryer","Furnace","Water leaking","Repair trimmer","Wood work"],
    ["Footsteps","Drinking","Eating","Baby crying","Dog/Cat","Light switch","Walking","Running","Car sounds","Bird sounds","Rain"],
    ["Person falling","Snoring","Coughing","Sneezing","Call for help","Smoke detector","Security alarm","Glass break"]
];

const ThemeMap = ["../img/cyber.jpg", "../img/island.jpg", "../img/desert.jpg"];


class HorizLine extends React.Component {
    render() {
        return (
            <div className="HorizLine" />
        );
    }
}

class Category extends React.Component {

    render() {
        return (
            <div className={this.props.name}>
                <div className="CheckboxHead">
                    <label><input type="checkbox" value="" onChange={() => this.props.allClick(this.props.idNum)}/> <span> {this.props.text} </span></label>
                </div>
                <HorizLine />
                <div className="Item">
                    {
                        React.Children.map(this.props.children, child =>  {
                            return React.cloneElement(child, {
                                allState: this.props.parentState,
                                parentId: this.props.idNum,
                                handleChange: this.props.changeState
                            })
                        })
                    }
                </div>
            </div>
        );
    }
}

class CategoryOption extends React.Component {

    render() {
        return (
            <div className="Checkbox">
                <label>
                    <input type="checkbox" checked={this.props.allState[this.props.parentId][this.props.idNum]} onChange={() => this.props.handleChange(this.props.parentId, this.props.idNum)} />
                    <span>{" " + CategorySubList[this.props.parentId][this.props.idNum]}</span>
                </label>
            </div>
        );
    }
}

class ThemeOption extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 0,
            isSelected: false,
        };
    };
    handleClick = () =>  {
        this.setState({
            isSelected: !this.state.isSelected
        });
    };
    render() {
        if (this.props.idNum !== 1) {
            return (
                <div className="ThemeUnselected">
                    <div className="ThemeImageBlock">
                        <img src={ThemeMap[this.props.idNum]} alt="Theme" />
                    </div>
                </div>
            );
        }
        if (this.state.isSelected === true) {
            return (
                <div className="ThemeSelected" onClick={this.handleClick}>
                    <div className="ThemeImageBlock">
                        <img src={ThemeMap[this.props.idNum]} alt="Theme" />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="ThemeUnselected" onClick={this.handleClick}>
                    <div className="ThemeImageBlock">
                        <img src={ThemeMap[this.props.idNum]} alt="Theme" />
                    </div>
                </div>
            );
        }
    }
}

class Theme extends React.Component {
    render() {
        return (
            <div className="ThemeBody">
                {
                    React.Children.map(this.props.children, function (child) {
                        return child;
                    })
                }
            </div>
        );
    };
}


class Create extends React.Component {
    constructor(props) {
        super(props);
        let newState = {
            time: Date.now(),
            description: "",
            title: "",
            childrenState: [],
            isSelected: [],
            is_published: true
        };
        for (let i = 0; i < CategoryList.length; i+=1) {
            newState.childrenState.push([]);
            newState.isSelected.push(false);
            for (let j = 0; j < CategorySubList[i].length; j+=1) {
                newState.childrenState[i].push(false);
            }
        }
        if (props.edit != null) {
            newState.time = new Date(props.edit.time);
            newState.title = props.edit.title;
            newState.description = props.edit.desc;
            newState.is_published = props.edit.is_published;
            for (let i = 0; i < CategoryLen; i += 1) {
                if (props.edit.categories[CategoryList[i]].length !== 0) {
                    for (let j = 0; j < props.edit.categories[CategoryList[i]].length; j += 1) {
                        let k = 0;
                        let str = props.edit.categories[CategoryList[i]][j];
                        while (k < CategorySubList[i].length && str !== CategorySubList[i][k]) {
                            k += 1;
                        }
                        if (k >= CategorySubList[i].length) {
                            k = 0;
                        } else {
                            newState.childrenState[i][k] = true;
                        }
                    }
                }
            }
        }
        this.state = newState;
    };

    changeState = (first, second) => {
        let currentState = this.state.childrenState;
        currentState[first][second] = !currentState[first][second];
        this.setState({childrenState: currentState})
    };

    changeTime = (event) => {
        this.setState({time: event._d});
    };

    changeTitle = (event) => {
        this.setState({title: event.target.value})
    };

    changeDesc = (event) => {
        this.setState({description: event.target.value})
    };

    changeIsPublished = () => {
        if (this.state.is_published) {
            if (!window.confirm('Are you sure not to publish your event? Viewers cannot find your event if it\'s not published.')) {
                return;
            }
        }

        this.setState({is_published: !this.state.is_published});
    };

    submitEvent = () => {
        if (!this.state.time) {
            alert("Time cannot be empty!");
            return
        }
        if (!this.state.title) {
            alert("Title cannot be empty!");
            return
        }
        if (!this.state.description) {
            alert("Description cannot be empty!");
            return
        }
        let newTime = this.state.time;
        let timeStr = newTime.toString();
        let submitObj = {
            "title": this.state.title,
            "desc": this.state.description,
            "time": timeStr,
            "categories": {},
            "is_published": this.state.is_published
        };
        let hasCategory = false;
        for (let i = 0; i < CategoryList.length; i++) {
            submitObj.categories[CategoryList[i]] = [];
            for (let j = 0; j < CategorySubList[i].length; j++) {
                if (this.state.childrenState[i][j] === true) {
                    submitObj.categories[CategoryList[i]].push(CategorySubList[i][j]);
                    hasCategory = true ;
                }
            }
        }
        if (hasCategory === false) {
            alert("Category cannot be empty!");
            return
        }
        let myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        let init = {
            method: 'POST',
            credentials: 'include', // cookies,
            mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(submitObj)
        };
        let apiUrl = CONFIG.serverIp + CONFIG.streamerEvents;
        if (this.props.edit != null) {
            init.method = 'PUT';
            let eventId = window.location.pathname.substr(6);
            apiUrl =  CONFIG.serverIp + CONFIG.streamerEvents + '/' + eventId;
        }
        fetch(
            apiUrl,
            init
        )
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if (data.failed) {
                throw new Error(data.msg || "Internal Error");
            }

            window.location.href = CONFIG.uiUrl
        })
        .catch( e => alert(e));
    };

    allClick = (first) =>  {
        let currentState = this.state.childrenState;
        currentState[first] = currentState[first].map(() => !this.state.isSelected[first]);
        let currentSelect = this.state.isSelected;
        currentSelect[first] = !currentSelect[first];
        this.setState({
            isSelected: currentSelect,
            childrenState: currentState
        });
    };
    render() {
        return (
            <div className="Create">
                <div className="CreateBody">
                    <div className="FirstPanel">
                        <Panel name="Category" text="Choose Sound Category">
                            <Category name="Row" text=" Kitchen" parentState={this.state.childrenState} idNum={0} changeState={this.changeState} allClick={this.allClick}>
                                <CategoryOption idNum={0}/>
                                <CategoryOption idNum={1}/>
                                <CategoryOption idNum={2}/>
                                <CategoryOption idNum={3}/>
                                <CategoryOption idNum={4}/>
                                <CategoryOption idNum={5}/>
                                <CategoryOption idNum={6}/>
                                <CategoryOption idNum={7}/>
                                <CategoryOption idNum={8}/>
                                <CategoryOption idNum={9}/>
                                <CategoryOption idNum={10}/>
                                <CategoryOption idNum={11}/>
                                <CategoryOption idNum={12}/>
                            </Category>
                            <div className="vl" />
                            <Category name="Row" text=" Bathroom" parentState={this.state.childrenState} parentSelected={this.state.isSelected} idNum={1} changeState={this.changeState} allClick={this.allClick}>
                                <CategoryOption idNum={0}/>
                                <CategoryOption idNum={1}/>
                                <CategoryOption idNum={2}/>
                                <CategoryOption idNum={3}/>
                                <CategoryOption idNum={4}/>
                                <CategoryOption idNum={5}/>
                                <CategoryOption idNum={6}/>
                                <CategoryOption idNum={7}/>
                                <CategoryOption idNum={8}/>
                                <CategoryOption idNum={9}/>
                                <CategoryOption idNum={10}/>
                                <CategoryOption idNum={11}/>
                                <CategoryOption idNum={12}/>
                            </Category>
                            <div className="vl" />
                            <Category name="Row" text=" Living" parentState={this.state.childrenState} parentSelected={this.state.isSelected} idNum={2} changeState={this.changeState} allClick={this.allClick}>
                                <CategoryOption idNum={0}/>
                                <CategoryOption idNum={1}/>
                                <CategoryOption idNum={2}/>
                                <CategoryOption idNum={3}/>
                                <CategoryOption idNum={4}/>
                                <CategoryOption idNum={5}/>
                                <CategoryOption idNum={6}/>
                                <CategoryOption idNum={7}/>
                                <CategoryOption idNum={8}/>
                                <CategoryOption idNum={9}/>
                                <CategoryOption idNum={10}/>
                                <CategoryOption idNum={11}/>
                                <CategoryOption idNum={12}/>
                            </Category>
                            <div className="vl" />
                            <Category name="Row" text=" Garage" parentState={this.state.childrenState} parentSelected={this.state.isSelected} idNum={3} changeState={this.changeState} allClick={this.allClick}>
                                <CategoryOption idNum={0}/>
                                <CategoryOption idNum={1}/>
                                <CategoryOption idNum={2}/>
                                <CategoryOption idNum={3}/>
                                <CategoryOption idNum={4}/>
                                <CategoryOption idNum={5}/>
                                <CategoryOption idNum={6}/>
                                <CategoryOption idNum={7}/>
                                <CategoryOption idNum={8}/>
                                <CategoryOption idNum={9}/>
                                <CategoryOption idNum={10}/>
                            </Category>
                            <div className="vl" />
                            <Category name="Row" text=" Ambience" parentState={this.state.childrenState} parentSelected={this.state.isSelected} idNum={4} changeState={this.changeState} allClick={this.allClick}>
                                <CategoryOption idNum={0}/>
                                <CategoryOption idNum={1}/>
                                <CategoryOption idNum={2}/>
                                <CategoryOption idNum={3}/>
                                <CategoryOption idNum={4}/>
                                <CategoryOption idNum={5}/>
                                <CategoryOption idNum={6}/>
                                <CategoryOption idNum={7}/>
                                <CategoryOption idNum={8}/>
                                <CategoryOption idNum={9}/>
                                <CategoryOption idNum={10}/>
                            </Category>
                            <div className="vl" />
                            <Category name="Row" text=" Concerning" parentState={this.state.childrenState} parentSelected={this.state.isSelected} idNum={5} changeState={this.changeState} allClick={this.allClick}>
                                <CategoryOption idNum={0}/>
                                <CategoryOption idNum={1}/>
                                <CategoryOption idNum={2}/>
                                <CategoryOption idNum={3}/>
                                <CategoryOption idNum={4}/>
                                <CategoryOption idNum={5}/>
                                <CategoryOption idNum={6}/>
                                <CategoryOption idNum={7}/>
                            </Category>

                        </Panel>

                        <Panel name="Theme" text="Choose Game Theme">
                            <Theme>
                                <ThemeOption idNum={0}> </ThemeOption>
                                <ThemeOption idNum={1}> </ThemeOption>
                                <ThemeOption idNum={2}> </ThemeOption>
                            </Theme>
                        </Panel>
                    </div>

                    <div className="SecondPanel">
                        <Panel name="Description" text="Event Brief">
                            <div className="Time">
                                <span className={"TimeSpan"}>Time</span>
                                <HorizLine />
                                <Datetime value={this.state.time} onChange={this.changeTime}/>
                            </div>
                            <div className="Title">
                                <span>Event Title</span>
                                <HorizLine />
                                <div className="form-group">
                                    <input className="form-control" id="title" value={this.state.title} onChange={this.changeTitle}/>
                                </div>
                            </div>
                            <div className="Brief">
                                <span>Description</span>
                                <HorizLine />

                                <div className="form-group">
                                    <textarea className="form-control" id="description" rows="8" value={this.state.description} onChange={this.changeDesc}/>
                                </div>
                            </div>
                            <div className="Time">
                                <label><input type="checkbox" checked={this.state.is_published} onChange={() => this.changeIsPublished()}/>&nbsp;Publish event to viewers</label>
                            </div>
                        </Panel>


                        <button className="Submit" onClick={this.submitEvent}>
                            <span>Send Event</span>
                        </button>
                    </div>
                </div>
            </div>

        );
    }
}

export default Create;