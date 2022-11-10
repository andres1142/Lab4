import React from "react";

export default class Error extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="Error">
                <h2> {this.props.error}</h2>
            </div>
        );
    }

}