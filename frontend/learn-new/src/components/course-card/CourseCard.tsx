import {
  Image,
  Box,
  Center,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  LayoutProps,
} from "@chakra-ui/react";
import { Course } from "@/types/models";

import { Link as RouterLink } from "react-router-dom";

export type CourseCardProps = {
  course: Course;
  width: LayoutProps["width"];
  height: LayoutProps["height"];
};

const defaultUrl =
  "https://icons.veryicon.com/png/o/miscellaneous/light-e-treasure-3/training-course.png";

export const CourseCard = ({ course, width, height }: CourseCardProps) => {
  return (
    <Box
      m="3"
      as={RouterLink}
      to={`/courses/${course.id}`}
      width={width}
      height={height}
      _hover={{ boxShadow: "2xl" }}
      bg={useColorModeValue("white", "gray.900")}
      boxShadow={"md"}
      rounded={"md"}
      p={6}
      overflow={"hidden"}
    >
      <Box h="50%" bg={"gray.100"} mt={-6} mx={-6} mb={6} pos={"relative"}>
        <Image
          src={
            !course.coverImageUrl || course.coverImageUrl.length === 0
              ? defaultUrl
              : course.coverImageUrl
          }
          height="100%"
        />
      </Box>
      <Stack height="50%" justifyContent="space-between">
        <Stack>
          <Text
            color={"blue.500"}
            textTransform={"uppercase"}
            fontWeight={800}
            fontSize={"sm"}
            letterSpacing={1.1}
          >
            {course.name}
          </Text>
          <Text color={"gray.500"}>{course.description}</Text>
        </Stack>
        <Stack direction={"column"} fontSize={"sm"}>
          <Text fontWeight={600}>{course.user?.name}</Text>
          <Text color={"gray.500"}>{course.dateCreated.toDateString()}</Text>
        </Stack>
      </Stack>
    </Box>
    // <Box
    //   width={width}
    //   height={height}
    //   as={RouterLink}
    //   to={`/courses/${course.id}`}
    // >
    //   <Box
    //     _hover={{ boxShadow: "2xl" }}
    //     bg={useColorModeValue("white", "gray.900")}
    //     boxShadow={"md"}
    //     rounded={"md"}
    //     p={6}
    //     overflow={"hidden"}
    //   >
    //     <Box
    //       h={"210px"}
    //       bg={"gray.100"}
    //       mt={-6}
    //       mx={-6}
    //       mb={6}
    //       pos={"relative"}
    //     >
    //       <Image src={course.coverImageUrl} height="210px" />
    //     </Box>

    //   </Box>
    // </Box>
  );
};
