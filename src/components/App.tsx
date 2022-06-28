import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Grommet, Main, Box } from 'grommet';

import { NavBar } from './Navbar';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { NotFound } from './pages/NotFound';
import { AddStock } from './pages/AddStock';
import { theme } from '../styles/theme';
import { useEffect } from 'react';
import { analytics } from '../firebase';
import { UserContextProvider } from './context/UserContextProvider';

const App = () => {
  useEffect(() => {
    // TODO add analytics warning to user
    analytics();
  }, []);

  return (
    <Grommet theme={theme as any}>
      <UserContextProvider>
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
      </UserContextProvider>
    </Grommet>
  );
};

export default App;
