import { useNavigate } from 'react-router-dom';
import { Box, Text, Button } from 'grommet';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box align="center" justify="center" pad="large">
      <Text size="5xl">
        Portfolio Planner
      </Text>
      <Box align="end" style={{ marginBottom: '3vh' }}>
        <Text size="large" style={{ fontStyle: 'italic' }}>
          &quot;Charlie and I are not stock-pickers; we are business-pickers&quot;
        </Text>
        <Text style={{ fontStyle: 'italic' }}>
          - Warren buffet, letter to shareholders 2021
        </Text>
      </Box>
      <Text>
        Portfolio Planner seeks to strengthen your conviction in key decisions on your investment journey. <br />
        Build a strong thesis in your investments for the long term future of businesses in your area of competence.
      </Text>
      <Text>
        <ul>
          <li>Build a portfolio of <strong>thesis</strong> rather than <strong>stocks</strong></li>
          <li>Set reminders to check in on your thesis when situations change</li>
          <li>Track performance of your thesis and find patterns in your thinking</li>
        </ul>
      </Text>
      <Button label="Get Started" onClick={() => navigate('/portfolio')} />
    </Box>
  );
};

export { Home };
