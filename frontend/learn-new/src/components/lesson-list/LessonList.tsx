import React from "react";

import {
  Image,
  Box,
  Center,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  VStack,
  StackDivider,
} from "@chakra-ui/react";
import { Lesson } from "@/types/models";

import { Link as RouterLink } from "react-router-dom";

type LessonListProps = {
  lessons: Lesson[];
};

export const LessonList = ({ lessons }: LessonListProps) => {
  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={4}
      align="stretch"
    >
      {lessons.map((lesson, i) => (
        <LessonItem key={i} lesson={lesson} />
      ))}
    </VStack>
  );
};

type LessonItem = {
  lesson: Lesson;
};

const LessonItem = ({ lesson }: LessonItem) => {
  return (
    <Center py={1} as={RouterLink} to={`/lessons/${lesson.id}`}>
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
            {lesson.title}
          </Heading>
        </Stack>
      </Box>
    </Center>
  );
};
