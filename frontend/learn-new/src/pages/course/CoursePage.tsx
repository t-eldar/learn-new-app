import { LessonList } from "@/components/lesson-list";
import { Course } from "@/types/models";
import { useParams } from "react-router-dom";
import {
  Stack,
  Flex,
  Button,
  Text,
  VStack,
  useBreakpointValue,
  StackDivider,
  useColorModeValue,
  Heading,
  Box,
} from "@chakra-ui/react";
import { getCourseById } from "@/services/course-service";
import { useQuery } from "react-query";
import { getLessonsByCourseId } from "@/services/lesson-service";
import { ErrorResult } from "@/components/error-result";
import { InfoResult } from "@/components/info-result";

import { Link as RouterLink } from "react-router-dom";
import { useIsOwner } from "@/hooks/use-is-owner";

export const CoursePage = () => {
  const color = useColorModeValue("gray.700", "white");

  const params = useParams();
  const id: number = Number(params.courseId);

  const {
    data: course,
    error: courseError,
    isLoading: courseIsLoading,
  } = useQuery("course", async () => await getCourseById(id));
  const {
    data: lessons,
    error: lessonsError,
    isLoading: lessonsAreLoading,
  } = useQuery("lessons", async () => await getLessonsByCourseId(id));

  const { isOwner } = useIsOwner(course);

  console.log(courseError);
  return (
    <>
      <Stack
        width="full"
        divider={<StackDivider borderColor="gray.200" />}
        spacing={4}
        align="stretch"
      >
        {courseError ? (
          <ErrorResult title="Ошибка при получении запроса!" />
        ) : !course ? (
          <InfoResult title="Курс не найден!" />
        ) : (
          <>
            <CourseHeading course={course} />
            <Heading
              alignSelf="center"
              marginY="5"
              color={color}
              fontSize={"2xl"}
              fontFamily={"body"}
            >
              Список уроков
            </Heading>
            {lessonsError ? (
              <ErrorResult title="Ошибка при получении запроса!" />
            ) : !lessons || lessons.length === 0 ? (
              <InfoResult title="Уроков ещё нет" />
            ) : (
              <LessonList lessons={lessons} />
            )}
            {isOwner ? <CourseFooter course={course} /> : null}
          </>
        )}
      </Stack>
    </>
  );
};

type CoursePageHeadingProps = {
  course: Course;
};
const CourseHeading = ({ course }: CoursePageHeadingProps) => {
  return (
    <Flex
      rounded="lg"
      w={"full"}
      h="50vh"
      backgroundImage={`url(${course.coverImageUrl})`}
      backgroundSize={"cover"}
      backgroundPosition={"top center"}
    >
      <VStack
        rounded="lg"
        w={"full"}
        justify={"center"}
        px={useBreakpointValue({ base: 4, md: 8 })}
        bgGradient={"linear(to-r, blackAlpha.600, transparent)"}
      >
        <Stack align={"flex-start"} spacing={6}>
          <Text
            color={"white"}
            fontWeight={700}
            lineHeight={1.2}
            fontSize={useBreakpointValue({ base: "3xl", md: "4xl" })}
          >
            {course.name}
          </Text>
          <Text
            color={"white"}
            lineHeight={1.2}
            fontSize={useBreakpointValue({ base: "2xl", md: "3xl" })}
          >
            {course.description}
          </Text>
        </Stack>
      </VStack>
    </Flex>
  );
};

type CourseFooterProps = {
  course: Course;
};

const CourseFooter = ({ course }: CourseFooterProps) => {
  return (
    <Box textAlign="center" mt="10">
      <Button
        as={RouterLink}
        to="/create-lesson"
        state={{ courseId: course.id }}
        bg="blue.600"
        _hover={{ background: "blue.400" }}
        color="white"
        variant="solid"
      >
        Создать урок
      </Button>
    </Box>
  );
};
