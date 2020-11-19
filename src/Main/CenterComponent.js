import React from "react";
import Paper from "@material-ui/core/Paper";
import {Typography} from "@material-ui/core";
import "../App.css"
import Home from "../Home/Home";
import Map from "../Map/Map";
import DashboardView from "../Dashboard/DashboardView";
import Contacts from "../Contacts/Contacts";
import ncdot_imap_data from '../data/ncdot_imap_v2.json';
// import QuadGraph from "../QuadGraph/QuadGraph";
// import SensitivityDashboard from "../Map/SensitivityMap";
import SensitivityDashboardV2 from "../Map/SensitivityMapV2";

class CenterComponent extends React.Component {
    // This component can be used as a simplified "route" to swap out what is shown using a conditional on a
    // prop passed from the Main component
    render() {
        if (this.props.displayStage === 0) {
            return <Home displayStageFunc={this.props.displayStageFunc}/>
        } else if (this.props.displayStage === 1) {
            return (
                <div style={{height: "calc(100% - 84px)"}}>
                    <Paper className='card' style={{height: '100%', marginTop: "10px"}}>
                        <div className='map-wrapper' style={{width: '100%', height: '100%', position: 'relative'}}>
                            <Map
                                mapCenter={[38.00049145082287, -79.17846679687501]}
                                roadwayData = {ncdot_imap_data}
                                primaryLayerName = "NC Roadways"
                            />
                        </div>
                    </Paper>
                </div>
            );
        } else if (this.props.displayStage === 2) {
            return (
                <div style={{height: "calc(100% - 84px)"}}>
                    <SensitivityDashboardV2
                        mapCenter={[38.00049145082287, -79.17846679687501]}
                        primaryLayer={ncdot_imap_data}
                        primaryLayerName="NC Roadways"
                    />
                </div>
            )
        } else if (this.props.displayStage === 3) {
            return (
                <div style={{height: "calc(100% - 84px)"}}>
                    <DashboardView
                        mapCenter={[38.00049145082287, -79.17846679687501]}
                        roadwayData = {ncdot_imap_data}
                        primaryLayerName = "NC Roadways"
                    />
                </div>
            )
        } else if (this.props.displayStage === 4) {
            return (
                <div style={{height: "calc(100% - 84px)"}}>
                    <Paper className='card' style={{height: '100%', marginTop: "10px"}}>
                        <Typography variant={"h4"}>
                            Placeholder About/Information View
                        </Typography>
                        Full screen Card Example. Replace with custom component.
                    </Paper>
                </div>
            )
        } else if (this.props.displayStage === 5) {
            return (
                <div style={{height: "calc(100% - 84px)"}}>
                    <Contacts />
                </div>
            )
        } else if (this.props.displayStage === 6) {
            return (
                // <QuadGraph />
                <div>
                    This development feature is still brewing!
                </div>
            )
        }
    }
}

export default CenterComponent;