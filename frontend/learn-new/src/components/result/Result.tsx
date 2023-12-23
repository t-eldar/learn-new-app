import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

type ResultProps = {
  title: string;
  message?: string;
  icon: ReactNode;
};

export const Result = ({ title, message, icon }: ResultProps) => {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Box display="inline-block">{icon}</Box>
      <Heading as="h2" size="xl" mt={6} mb={2}>
        {title}
      </Heading>
      {message ? <Text color={"gray.500"}>{message}</Text> : null}
    </Box>
  );
};
