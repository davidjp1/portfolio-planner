import { Box, Text } from 'grommet';

export const IntroInfo = () => (
  <Box align="center" justify="center" pad="xsmall">
    <div>
      <Text size="5xl">Portfolio Planner</Text>
    </div>
    <div>
      <Box align="end" style={{ marginBottom: '3vh' }}>
        <Text size="large" style={{ fontStyle: 'italic' }}>
          &quot;Charlie and I are not stock-pickers; we are
          business-pickers&quot;
        </Text>
        <Text style={{ fontStyle: 'italic' }}>
          - Warren buffet, letter to shareholders 2021
        </Text>
      </Box>
    </div>
    <div>
      <Text>
        Portfolio Planner seeks to strengthen your conviction in key decisions
        on your investment journey. <br />
        Build a strong thesis in your investments for the long term future of
        businesses in your area of competence.
      </Text>
    </div>
    <div>
      <Text>
        <ul>
          <li>
            Build a portfolio of <strong>thesis</strong> rather than{' '}
            <strong>stocks</strong>
          </li>
          <li>
            Set reminders to check in on your thesis when situations change
          </li>
          <li>
            Track performance of your thesis and find patterns in your thinking
          </li>
        </ul>
      </Text>
    </div>
  </Box>
);
