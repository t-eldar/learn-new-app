import { ChangeEventHandler, useEffect } from "react";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { signUp } from "@/services/auth-service";
import { useAuthentication } from "@/hooks/use-authentication";

export const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const toast = useToast();

  const { setIsLoggedIn } = useAuthentication() ?? { setIsLoggedIn: undefined };

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [valid, setValid] = useState(true);

  const {
    data: signedUp,
    error,
    refetch,
  } = useQuery(
    "sign-up",
    async () => {
      return await signUp({
        name,
        surname,
        password,
        email,
      });
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

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

  useEffect(() => {
    if (typeof signedUp !== "undefined") {
      if (signedUp) {
        setValid(true);
        setIsLoggedIn(true);
        navigate("/", { replace: true });
      } else {
        setValid(false);
      }
    }
  }, [signedUp]);

  useEffect(() => {
    if (error) {
      setValid(false);
    } else {
      setValid(true);
    }
  }, [error]);

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
  const handlNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setValid(true);
    setName(e.currentTarget.value);
  };
  const handlSurnameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setValid(true);
    setSurname(e.currentTarget.value);
  };

  const handleSignUp = () => {
    refetch();
  };

  return (
    <Flex
      minH={"90vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.900")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Зарегистрируйтесь
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            чтобы начать учиться или обучать новому✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired isInvalid={!valid}>
                  <FormLabel>Имя</FormLabel>
                  <Input value={name} onChange={handlNameChange} type="text" />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName" isRequired isInvalid={!valid}>
                  <FormLabel>Фамилия</FormLabel>
                  <Input
                    value={surname}
                    onChange={handlSurnameChange}
                    type="text"
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired isInvalid={!valid}>
              <FormLabel>Email</FormLabel>
              <Input value={email} onChange={handleEmailChange} type="email" />
            </FormControl>
            <FormControl id="password" isRequired isInvalid={!valid}>
              <FormLabel>Пароль</FormLabel>
              <InputGroup>
                <Input
                  value={password}
                  onChange={handlePasswordChange}
                  type={showPassword ? "text" : "password"}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                onClick={handleSignUp}
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Зарегистрироваться
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Уже зарегистрированы?{" "}
                <Link as={RouterLink} to={"/sign-in"} color={"blue.400"}>
                  Войти
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};
