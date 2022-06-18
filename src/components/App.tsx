import {Grommet, Main, Box} from 'grommet';
import {theme} from '../styles/theme';
import {Home} from './pages/Home';
import {Portfolio} from './pages/Portfolio';
import {Routes , Route, BrowserRouter} from 'react-router-dom';
import {NavBar} from './Navbar';
import {NotFound} from './pages/NotFound';
import {AddStock} from './pages/AddStock';

function App() {
  return <Grommet theme={theme as any}>
    <BrowserRouter>
      <Box fill="vertical" overflow="auto" align="center" flex="grow">
        <NavBar/>
        <Main fill flex="grow" overflow="auto">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/portfolio" element={<Portfolio/>}/>
            <Route path="/portfolio/add" element={<AddStock/>}/>
            <Route path="*" element={<NotFound />} />
          </Routes >
        </Main>
      </Box>
    </BrowserRouter>
  </Grommet>;
}

export default App;