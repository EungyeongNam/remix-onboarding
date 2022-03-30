import {
  createContext,
  FC,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useContext,
} from "react";

export interface IProfile {
  email: string;
  sub: string;
}

interface IAuthContext {
  profile: IProfile | null;
  isLoggedIn: boolean;
  setProfile: Dispatch<SetStateAction<IProfile | null>>;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<IAuthContext>({
  profile: null,
  isLoggedIn: false,
  setProfile: () => undefined,
  setIsLoggedIn: () => undefined,
});

const AuthProvider: FC = ({ children }) => {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 컴포넌트가 렌더링될 때만 한번 실행
  useEffect(() => {
    const rawProfile = localStorage.getItem("profile");
    const accessToken = localStorage.getItem("access_token");

    if (rawProfile && accessToken) {
      const profile: IProfile = JSON.parse(rawProfile);
      setProfile(profile);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        profile,
        setProfile,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;