import { useAuthentication } from "@/hooks/use-authentication";
import { signOut } from "@/services/auth-service";
import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
export const UserButton = () => {
  const { authUser, setIsLoggedIn, isLoggedIn } = useAuthentication() ?? {
    authUser: undefined,
    setAuthUser: undefined,
  };
  const toast = useToast();
  const navigate = useNavigate();

  const {
    data,
    error,
    refetch: logOut,
  } = useQuery("logout", signOut, {
    enabled: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (error) {
      toast({
        status: "error",
        isClosable: true,
        title: "Не удалось выйти!",
      });
    }
    if (data) {
      setIsLoggedIn!(false);
      navigate("/");
    }
  }, [data, error]);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    console.log(authUser);
    
    if (!authUser) {
      navigate("/sign-in");
    } else {
      logOut();
      navigate("#");
    }
  };

  return (
    <Flex justifyContent="center" alignItems="center" onClick={handleClick}>
      <Button
        aria-label="Toggle Color Mode"
        _focus={{ boxShadow: "none" }}
        w="fit-content"
      >
        {!authUser ? <FiLogIn /> : <FiLogOut />}
      </Button>
    </Flex>
  );
};
