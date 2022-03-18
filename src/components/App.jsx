import {Grommet, Main, Box} from 'grommet';
import {theme} from '../styles/theme';
import {Home} from './Home';
import {Portfolio} from './Portfolio';
import {Routes , Route, BrowserRouter} from 'react-router-dom';
import {NavBar} from './Navbar';
import {NotFound} from './NotFound';
import {AddStock} from './AddStock';

function App() {
  return <Grommet theme={theme}>
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