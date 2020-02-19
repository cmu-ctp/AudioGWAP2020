import Create from "./create";
import React from "react";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: null
        };
    };
    componentWillMount() {
        let eventId = window.location.pathname.substr(6);
        let getApi = "https://echoes.etc.cmu.edu/api/streamer/events/" + eventId;
        let init = {
            method: 'GET',
            credentials: 'include', // cookies,
            mode: 'cors'
        };
        fetch(
            getApi,
            init
        )
        .then(
            res => res.json()
        )
        .then(data => {
            if (data.failed) {
                throw new Error(data.msg || "Internal Error");
            }
            
            this.setState({
                edit: data.result,
            })
        })
        .catch( e => alert(e));
    }

    render() {
        if (this.state.edit == null) {
            return (
              <span>Waiting!</span>
            );
        } else {
            return (
                <Create edit={this.state.edit}/>
            );
        }
    }

}

export default Edit;