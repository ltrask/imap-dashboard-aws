import React from 'react';
import ncdot_imap_data from "../data/ncdot_imap_v2.json";
import SensitivityDashboardV2 from "./SensitivityMapV2";

const NCSensitivityMap = () => {
    return (
        <SensitivityDashboardV2
            mapCenter={[38.00049145082287, -79.17846679687501]}
            primaryLayer={ncdot_imap_data}
            primaryLayerName="NC Roadways"
        />
    )
}

export default NCSensitivityMap;