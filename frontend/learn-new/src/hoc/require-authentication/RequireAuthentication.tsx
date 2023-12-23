import { useAuthentication } from "@/hooks/use-authentication";
import { Navigate, useLocation } from "react-router-dom";

type RequireAuthenticationProps = {
  children: JSX.Element;
};

export const RequireAuthentication = ({
  children,
}: RequireAuthenticationProps) => {
  const location = useLocation();

  const { isLoggedIn, authUser } = useAuthentication()!;

  if (!isLoggedIn || !authUser) {
    return <Navigate to="/sign-in" state={{ from: location }} />;
  }

  return children;
};
