import {
  Box,
  Center,
  Heading,
  Stack,
  StackDivider,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Test } from "@/types/models";
import { Link as RouterLink } from "react-router-dom";
type TestListProps = {
  tests: Test[];
};

export const TestList = ({ tests }: TestListProps) => {
  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={4}
      align="stretch"
    >
      {tests.map((test, i) => (
        <TestItem test={test} key={i} />
      ))}
    </VStack>
  );
};

type TestItem = {
  test: Test;
};
const TestItem = ({ test }: TestItem) => {
  return (
    <Center py={1} as={RouterLink} to={`/tests/${test.id}`}>
      <Box
        width="100%"
        bg={useColorModeValue("white", "gray.900")}
        _hover={{ boxShadow: "xl" }}
        boxShadow={"md"}
        rounded={"md"}
        p={6}
        overflow={"hidden"}
      >
        <Stack>
          <Heading
            color={useColorModeValue("gray.700", "white")}
            fontSize={"2xl"}
            fontFamily={"body"}
          >
            {test.title}
          </Heading>
        </Stack>
      </Box>
    </Center>
  );
};
