import { useAuthentication } from "@/hooks/use-authentication";
import { useLogIn } from "@/hooks/use-log-in";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

export const SignInForm = () => {
  const { authUser } = useAuthentication() ?? { authUser: undefined };
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!!authUser) {
      navigate(location.state?.from ?? "/", { replace: true });
    }
  }, [authUser]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [valid, setValid] = useState(true);

  const { isLogged, logIn } = useLogIn({
    password,
    email,
    rememberMe: true,
  });

  useEffect(() => {
    if (!(typeof isLogged === "undefined")) {
      if (isLogged) {
        console.log(isLogged);

        setValid(true);
        navigate("/", {
          replace: true,
        });
      } else {
        setValid(false);
      }
    }
  }, [isLogged]);

  const handleEmailChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setValid(true);
    setEmail(e.currentTarget.value);
  };
  const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setValid(true);
    setPassword(e.currentTarget.value);
  };

  const handleSignIn = () => {
    logIn();
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Войдите</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            чтобы начать учиться новому ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email" isInvalid={!valid}>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={handleEmailChange} />
            </FormControl>
            <FormControl id="password" isInvalid={!valid}>
              <FormLabel>Пароль</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </FormControl>
            <Stack spacing={10}>
              <Button
                onClick={handleSignIn}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Войти
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Ещё не зарегистрированы?{" "}
                <Link as={RouterLink} to={"/sign-up"} color={"blue.400"}>
                  Зарегистрироваться
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};
