import { useState, FunctionComponent } from 'react';
import { Button, Box, TextInput } from 'grommet';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import { GridApi } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const columnBase = { resizable: true, editable: false };
const columnDetails = [{ field: 'ticker', headerName: 'Ticker' }];
const columns = columnDetails.map((col) => ({ ...columnBase, ...col }));

interface PositionsTableRow {
  ticker: string;
}

interface Props {
  initialData?: PositionsTableRow[];
  onTickerSelected: (ticker: string) => void;
}

// Editable ag-grid to display and set trade positions
const PositionsTable: FunctionComponent<Props> = ({
  initialData = [],
  onTickerSelected,
}) => {
  const [tickerInp, setTickerInp] = useState('');
  const [data, setData] = useState(initialData);
  const [gridApi, setGridApi] = useState<GridApi | null>();

  const onGridReady = ({ api }: { api: GridApi }) => {
    setGridApi(api);
  };

  const onRowSelected = () => {
    if (!gridApi) {
      return;
    }
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
      onTickerSelected(selectedRows[0].ticker);
    }
  };

  const addTicker = () => {
    setData((d) => [...d, { ticker: tickerInp }]);
  };

  return (
    <Box fill="horizontal" style={{ height: '200px' }}>
      <div style={{ display: 'flex' }}>
        <TextInput
          placeholder="Enter a ticker symbol"
          onChange={(event) => setTickerInp(event.target.value.toUpperCase())}
        />
        <Button label="Add Row" style={{ width: '50%' }} onClick={addTicker} />
      </div>
      {data.length > 0 && (
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            rowData={data}
            onGridReady={onGridReady}
            onRowSelected={onRowSelected}
            rowSelection="single"
          >
            {columns.map((col) => (
              <AgGridColumn {...col} key={`col-${col.field}`} />
            ))}
          </AgGridReact>
        </div>
      )}
    </Box>
  );
};

export { PositionsTable };
