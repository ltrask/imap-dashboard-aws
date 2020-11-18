import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

export default function BasisPaginationGrid(props) {
    // console.log(data);
    const rowData = props.tableData.features.map(feat => feat.properties);

    // console.log(rowData);
    for (let rdi = 0; rdi < rowData.length; rdi++) {
        rowData[rdi].id = rowData[rdi].fid;
    }

    let tableData = {
        columns: [
            {field: "fid", headerName: "ID", width:50},
            {field: "route_id", headerName: "Seg ID", width:150},
            {field: "route_class", headerName: "Route Class", width:150},
            {field: "route_no", headerName: "Route #", width:100},
            {field: "inc_fac", headerName: "Incident Factor", width:150},
            {field: "detour_fac", headerName: "Detour Factor", width:150}
            ],
        rows: rowData
    }

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <DataGrid rowHeight={25} pagination {...tableData} />
        </div>
    );
}