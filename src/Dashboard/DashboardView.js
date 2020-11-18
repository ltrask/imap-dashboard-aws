import React from "react";
import Paper from "@material-ui/core/Paper";
import {Typography} from "@material-ui/core";
import Map from "../Map/Map";
import BasisPaginationGrid from "../Table/SimpleTable";

class DashboardView extends React.Component {
    render() {
        return (
            <div style={{width: "100%", height: "100%", display: "inline-flex"}}>
                <div style={{width: "66%", height: "100%"}}>
                    <Paper className='card' style={{height: '55%', marginTop: "10px"}}>
                        <div className='map-wrapper' style={{width: '100%', height: '100%', position: 'relative'}}>
                            <Map
                                roadwayData={this.props.roadwayData}
                                primaryLayerName={this.props.primaryLayerName}
                                markerStart={this.props.mapCenter}
                            />
                        </div>
                    </Paper>
                    <Paper style={{
                        height: 'calc(45% - 5px)',
                        marginTop: "5px",
                        marginBottom: "10px",
                        overflow: "auto"
                    }}>
                        <BasisPaginationGrid
                            tableData={this.props.roadwayData}
                        />
                    </Paper>
                </div>
                <div style={{width: "34%", height: "100%", paddingLeft: "5px", paddingRight: "5px"}}>
                    <Paper className='card' style={{height: '100%', marginTop: "10px"}}>
                        <Typography variant={"h5"}>Sidebar</Typography>
                        In this version, the sidebar has 100% height of the center area, and the table only has 66%
                        width.
                    </Paper>
                </div>
            </div>
        );
    }
}

export default DashboardView;