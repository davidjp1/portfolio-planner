import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Grommet, Main, Box } from 'grommet';

import { NavBar } from './Navbar';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { NotFound } from './pages/NotFound';
import { AddStock } from './pages/AddStock';
import { theme } from '../styles/theme';

const App = () => {
  return (
    <Grommet theme={theme as any}>
      <BrowserRouter>
        <Box fill="vertical" overflow="auto" align="center" flex="grow">
          <NavBar />
          <Main fill flex="grow" overflow="auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/add" element={<AddStock />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Main>
        </Box>
      </BrowserRouter>
    </Grommet>
  );
};

export default App;
