import { CourseCard } from "@/components/course-card";
import { getAllCourses } from "@/services/course-service";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import { ErrorResult } from "@/components/error-result";
import { InfoResult } from "@/components/info-result";

export const CoursesPage = () => {
  const { data: courses, error } = useQuery("courses", getAllCourses);

  return (
    <>
      <Heading
        marginY="3"
        bgGradient="linear(to-r, blue.400, blue.600)"
        backgroundClip="text"
      >
        Курсы
      </Heading>
      <Divider borderColor="gray.200" my="3" />
      {error ? (
        <ErrorResult title="Ошибка при получении курсов" />
      ) : !courses ? (
        <InfoResult title="Курсов еще нет!" />
      ) : (
        <Flex width="100%" justifyContent="space-between" flexWrap="wrap">
          {courses.map((course, i) => (
            <CourseCard width="300px" height="400px" key={i} course={course} />
          ))}
        </Flex>
      )}
      <Divider borderColor="gray.200" my="5" />
      <Footer />
    </>
  );
};

const Footer = () => {
  return (
    <Box textAlign="center">
      <Heading
        as="h2"
        size="xl"
        bgGradient="linear(to-r, blue.400, blue.600)"
        backgroundClip="text"
      >
        Не нашли то, что искали?
      </Heading>
      <Text color={"gray.500"} mb={6}>
        Создайте свой собственный курс
      </Text>

      <Button
        as={RouterLink}
        to="/create-course"
        bg="blue.600"
        _hover={{ background: "blue.400" }}
        color="white"
        variant="solid"
      >
        Создать
      </Button>
    </Box>
  );
};
