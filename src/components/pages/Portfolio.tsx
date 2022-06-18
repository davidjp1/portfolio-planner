import {useState} from 'react';
import { PositionsTable } from '../PositionsTable';
import {StockDisplay} from '../StockDisplay';
import {Grid} from 'grommet';

function Portfolio() {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  
  return <Grid pad="large">
    <PositionsTable onTickerSelected={setSelectedTicker}/>    
    {selectedTicker !== null && <StockDisplay symbol={selectedTicker}/>}
  </Grid>;
}
export {Portfolio};