import { createContext } from "react";
import { AuthUser } from "authentication";

type AuthUserContext = {
  authUser?: AuthUser;
  setAuthUser?: React.Dispatch<React.SetStateAction<AuthUser | undefined>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AuthenticationContext = createContext<AuthUserContext | null>(
  null
);
