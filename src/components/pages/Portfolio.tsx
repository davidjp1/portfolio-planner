import {useRef, useState} from 'react';
import { PositionsTable } from '../PositionsTable';
import {StockDisplay} from '../StockDisplay';
import {Grid} from 'grommet';

function Portfolio() {
  const tableRef = useRef();
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  return <Grid pad="large">
    <PositionsTable ref={tableRef} setSelectedTicker={setSelectedTicker}/>    
    {selectedTicker !== null && <StockDisplay symbol={selectedTicker}/>}
  </Grid>;
}
export {Portfolio};