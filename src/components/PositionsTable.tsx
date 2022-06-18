import { Button, Box, TextInput } from 'grommet';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useState, forwardRef, useImperativeHandle, SetStateAction, Dispatch } from 'react';

const columnBase = {resizable: true, editable: false};
const columnDetails = [
  { field: 'ticker', headerName: 'Ticker'}
];
const columns = columnDetails.map(col => ({...columnBase, ...col}));

// Editable ag-grid to display and set trade positions
const PositionsTable = forwardRef(({initialData = [], setSelectedTicker}: {initialData?: any[], setSelectedTicker: Dispatch<SetStateAction<string | null>>}, ref) => {
  const [tickerInp, setTickerInp] = useState('');
  const [data, setData] = useState(initialData);
  const [gridApi, setGridApi] = useState<any>(null);

  
    
  const onGridReady = ({api}: {api: any}) => {
    setGridApi(api);
  };
  const onRowSelected = () => {
    if(!gridApi){
      return;
    }
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
      setSelectedTicker(selectedRows[0].ticker);
    }
  };

  useImperativeHandle(ref, () => ({
    getTableData: () => {
      const rowData: any[] = [];
      gridApi.forEachNode((node: any) => rowData.push(node.data));
      return rowData;
    }
  }));

  const addTicker = () => {
    setData(d => [...d, {ticker: tickerInp}]);
  };

  return <Box fill="horizontal" style={{ height: '200px'}}>
    <div style={{display: 'flex'}}>
      <TextInput
        placeholder="Enter a ticker symbol"
        onChange={event => setTickerInp(event.target.value)}
      />
      <Button label="Add Row" style={{width: '50%'}} onClick={() => addTicker()}/>
    </div>
    {data.length > 0 && <div className="ag-theme-alpine" style={{height: 400, width: '100%'}}>
      <AgGridReact rowData={data} onGridReady={onGridReady} onRowSelected={onRowSelected} rowSelection='single'>
        {columns.map(col => <AgGridColumn {...col} key={`col-${col.field}`} />)}
      </AgGridReact>
    </div>}
  </Box>;
});
export {PositionsTable};
