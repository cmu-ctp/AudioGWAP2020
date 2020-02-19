import React from "react";

class Panel extends React.Component {
    render() {
        return (
            <div className={this.props.name}>
                <div className="frame">
                    <div className="background">
                        <span>{this.props.text}</span>
                    </div>
                </div>
                <div className="body">
                    {
                        React.Children.map(this.props.children, function (child) {
                            return child;
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Panel;