import {
  getAuth,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  User,
  UserCredential,
  signOut,
} from 'firebase/auth';
import {
  createContext,
  useState,
  FunctionComponent,
  useContext,
  useMemo,
} from 'react';
import Cookies from 'js-cookie';

interface GoogleUserContext {
  user: User | undefined;
  googleSignIn: () => Promise<UserCredential>;
  googleSignOut: () => Promise<void>;
}

const UserContext = createContext<GoogleUserContext | undefined>(undefined);
const provider = new GoogleAuthProvider();

// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

export const UserContextProvider: FunctionComponent = ({ children }) => {
  const auth = getAuth();
  const [user, setUser] = useState<User>();

  useMemo(() => {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        const token = await u.getIdToken();
        Cookies.set('idToken', token);
        setUser(u);
      } else {
        Cookies.remove('idToken');
        setUser(undefined);
      }
    });
  }, []);

  const googleSignIn = () => {
    auth.useDeviceLanguage();

    return signInWithPopup(auth, provider);
  };

  const googleSignOut = () => {
    return signOut(auth);
  };

  return (
    <UserContext.Provider value={{ user, googleSignIn, googleSignOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): GoogleUserContext => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser called outside of UserContextProvider');
  }
  return context;
};
