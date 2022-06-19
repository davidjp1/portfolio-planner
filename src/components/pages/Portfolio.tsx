import { useState } from 'react';
import { Grid } from 'grommet';

import { PositionsTable } from '../PositionsTable';
import { StockDisplay } from '../StockDisplay';

const Portfolio = () => {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  return (
    <Grid pad="large">
      <PositionsTable onTickerSelected={setSelectedTicker} />
      {selectedTicker !== null && <StockDisplay symbol={selectedTicker} />}
    </Grid>
  );
};

export { Portfolio };
