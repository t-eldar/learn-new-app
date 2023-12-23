import { signIn } from "@/services/auth-service";
import { useToast } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useAuthentication } from "../use-authentication";

import { useEffect } from "react";
import { SignInRequest } from "@/types/models";

export const useLogIn = (signInRequest: SignInRequest) => {
  const toast = useToast();

  const { isLoggedIn, setIsLoggedIn } = useAuthentication() ?? {
    isLoggedIn: false,
    setIsLoggedIn: undefined,
  };

  function assertSetIsLoggedIn(
    value: React.Dispatch<React.SetStateAction<boolean>> | undefined
  ): asserts value is React.Dispatch<React.SetStateAction<boolean>> {
    if (!value) {
      toast({
        status: "error",
        isClosable: true,
        title: "Внутренняя ошибка, попробуйте позже!",
      });
    }
  }

  assertSetIsLoggedIn(setIsLoggedIn);

  const {
    data: isLogged,
    status,
    refetch: logIn,
  } = useQuery(
    ["sign-in", signInRequest],
    async () => await signIn(signInRequest),
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!!isLogged) {
      setIsLoggedIn(true);
    }
    console.log(isLogged);
  }, [isLogged]);

  return { isLogged: isLoggedIn, logIn };
};
