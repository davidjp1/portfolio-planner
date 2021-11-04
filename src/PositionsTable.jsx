import { Button } from '@mui/material';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useState, forwardRef, useImperativeHandle } from 'react';

const columnBase = {resizable: true};
const columnDetails = [
    { field: 'ticker', headerName: 'Ticker', width: 120, editable: true },
    { field: 'position', headerName: 'Number of Shares', editable: true },
    { field: 'value', headerName: 'Value ($)' },
    { field: 'change', headerName: 'Loss / Earnings' },
    { field: 'notes', headerName: 'Notes', editable: true }
];
const columns = columnDetails.map(col => ({...columnBase, ...col}));

// Editable ag-grid to display and set trade positions
const PositionsTable = forwardRef(({initialData = [], setSelectedTicker}, ref) => {
    const [data, setData] = useState(initialData);
    const [gridApi, setGridApi] = useState(null);
    
    const onGridReady = ({api}) => {
        setGridApi(api);
    }
    const onRowSelected = () => {
        const selectedRows = gridApi.getSelectedRows();
        if (selectedRows.length > 0) {
            setSelectedTicker(selectedRows[0].ticker);
        }
    }

    useImperativeHandle(ref, () => ({
        getTableData: () => {
            let rowData = [];
            gridApi.forEachNode(node => rowData.push(node.data));
            return rowData;
        }
    }));

    return <div style={{ height: 100, width: '1000px' }}>
        <Button variant="outlined" onClick={() => setData(d => [...d, {}])}>Add Row</Button>
        <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
            <AgGridReact rowData={data} onGridReady={onGridReady} onRowSelected={onRowSelected} rowSelection='single'>
                {columns.map(col => <AgGridColumn {...col} key={`col-${col.field}`} />)}
            </AgGridReact>
       </div>
    </div>
});
export {PositionsTable};
