import { Box } from 'grommet';
import { IntroInfo } from '../IntroInfo';
import { SignInButton } from '../SignInButton';

const Home = () => (
  <Box align="center" justify="center" pad="xsmall">
    <IntroInfo />
    <SignInButton />
  </Box>
);

export { Home };
