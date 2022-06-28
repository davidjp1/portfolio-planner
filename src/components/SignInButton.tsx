import GoogleButton from 'react-google-button';
import { useNavigate } from 'react-router-dom';
import { useUser } from './context/UserContextProvider';

export const SignInButton = () => {
  const navigate = useNavigate();
  const { user, googleSignIn, googleSignOut } = useUser();

  const onSignIn = async () => {
    await googleSignIn()
      .then(() => navigate('/portfolio'))
      // TODO error handling
      .catch((e) => console.error(e));
  };
  const onSignOut = async () => {
    await googleSignOut()
      .then(() => navigate('/'))
      // TODO error handling
      .catch((e) => console.error(e));
  };

  return (
    <GoogleButton
      onClick={!user ? onSignIn : onSignOut}
      label={!user ? 'Sign In with Google' : 'Sign Out'}
    />
  );
};
