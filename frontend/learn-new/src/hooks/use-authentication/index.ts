import { AuthenticationContext } from "@/context/authentication-context";
import { useContext } from "react";

export const useAuthentication = () => useContext(AuthenticationContext);
