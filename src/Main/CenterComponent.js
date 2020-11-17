import React from "react";
import "../App.css"

class CenterComponent extends React.Component {
    // This component can be used as a simplified "route" to swap out what is shown using a conditional on a
    // prop passed from the Main component
    render() {
        return (
            <div style={{height: "calc(100% - 84px)"}}>
                The selected center component is: {this.props.displayStage}
            </div>
        );
    }
}

export default CenterComponent;