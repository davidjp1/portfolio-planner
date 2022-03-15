import {Nav, Text, Button} from 'grommet';
import {Analytics, CircleInformation} from 'grommet-icons';
import {Link, useNavigate} from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();

  return <Nav align="end" direction="row" justify="end" fill="horizontal" pad="small" background={{'color':'brand'}} full>
    <Text size="xlarge" weight="bold">
      <Link to="/" className='nostyle'>Portfolio Builder</Link >
    </Text>
    <Button label="My Investments" icon={<Analytics />} onClick={() => navigate('/portfolio')}/>
    <Button label="About" icon={<CircleInformation />} onClick={() => navigate('/about')}/>
  </Nav>;
}
export {NavBar};