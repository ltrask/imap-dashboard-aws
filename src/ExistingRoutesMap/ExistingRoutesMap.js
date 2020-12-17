import React from 'react';
import Paper from "@material-ui/core/Paper";
import Map from "../Map/Map";
import ncdot_imap_data from "../data/ncdot_imap_v2.json";

const ExistingRoutesMap = () => {


    return (
        <Paper className='card' style={{height: '100%', marginTop: "10px"}}>
            <div className='map-wrapper' style={{width: '100%', height: '100%', position: 'relative'}}>
                <Map
                    mapCenter={[38.00049145082287, -79.17846679687501]}
                    roadwayData = {ncdot_imap_data}
                    primaryLayerName = "NC Roadways"
                />
            </div>
        </Paper>
    );
}

export default  ExistingRoutesMap;