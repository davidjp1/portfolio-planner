import { Link, useNavigate } from 'react-router-dom';
import { Nav, Text, Button, Menu } from 'grommet';
import { Analytics, CircleInformation, Menu as MenuIcon } from 'grommet-icons';

const NavBar = () => {
  const navigate = useNavigate();

  const buttons = [
    {
      label: 'My Investments',
      icon: <Analytics />,
      onClick: () => navigate('/portfolio'),
    },
    {
      label: 'About',
      icon: <CircleInformation />,
      onClick: () => navigate('/about'),
    },
  ];

  return (
    <Nav
      align="end"
      direction="row"
      justify="end"
      fill="horizontal"
      pad="small"
      background={{ color: 'brand' }}
    >
      <Text size="xlarge" weight="bold">
        <Link to="/" className="nostyle">
          Portfolio Planner
        </Link>
      </Text>
      {screen.width > 600 ? (
        buttons.map((a) => <Button {...a} key={a.label} />)
      ) : (
        <Menu items={buttons} icon={<MenuIcon />} />
      )}
    </Nav>
  );
};
export { NavBar };
