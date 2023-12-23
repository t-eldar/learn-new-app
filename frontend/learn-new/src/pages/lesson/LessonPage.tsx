import { useState, useEffect } from "react";

import { ErrorResult } from "@/components/error-result";
import { InfoResult } from "@/components/info-result";
import { RichTextEditor } from "@/components/slate/rich-text-editor";
import { TestList } from "@/components/test-list";
import { getLessonById, updateLesson } from "@/services/lesson-service";
import { getTestsByLessonId } from "@/services/test-service";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Switch,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Lesson, Test } from "@/types/models";
import { useQuery } from "react-query";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useIsOwner } from "@/hooks/use-is-owner";
import { MdEdit, MdEditOff, MdOutlineEdit } from "react-icons/md";
import { m } from "framer-motion";

export const LessonPage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [content, setContent] = useState("");
  const [isHidden, setIsHidden] = useState(false);

  const themedColor = useColorModeValue("gray.700", "white");
  const toast = useToast();
  const params = useParams();
  const id = Number(params.lessonId);

  const { data: lesson, error: lessonError } = useQuery(
    ["lesson", id],
    async () => {
      const result = await getLessonById(id);
      if (result) {
        setContent(result.content);
      }
      return result;
    }
  );
  const { data: tests, error: testsError } = useQuery(
    ["tests", id],
    async () => await getTestsByLessonId(id)
  );

  const {
    status: editStatus,
    refetch: edit,
    error: editError,
  } = useQuery(
    ["edit", id],
    async () => {
      if (!lesson) {
        return;
      }
      return await updateLesson({
        id: lesson.id,
        content,
        isHidden,
      });
    },
    { enabled: false, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (editStatus === "success") {
      toast({
        status: "success",
        title: "Успешно изменено!",
        isClosable: true,
      });
    } else if (editStatus === "error") {
      toast({
        status: "error",
        title: "Произошла ошибка!",
        isClosable: true,
      });
    }
  }, [editStatus]);

  const { isOwner } = useIsOwner(lesson);

  const handleEditChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setIsEdit(e.target.checked);
  };

  const handleSave: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    edit();
  };

  const handleHiddenChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    e.preventDefault();
    setIsHidden(e.target.checked);
  };

  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      height="100%"
    >
      {lessonError ? (
        <ErrorResult title="Произошла ошибка при получении урока" />
      ) : !lesson ? (
        <InfoResult title="Урок не найден" />
      ) : (
        <>
          <Stack
            width="full"
            divider={<StackDivider borderColor="gray.200" />}
            spacing={4}
            align="stretch"
          >
            <Flex justifyContent="space-between">
              <Heading color={themedColor} fontSize={"2xl"} fontFamily={"body"}>
                {lesson.title}
              </Heading>
              {isOwner ? (
                <Flex justifyContent="center" alignItems="center">
                  <Switch mr="3" onChange={handleEditChange} />
                  {isEdit ? <MdEdit /> : <MdEditOff />}
                </Flex>
              ) : null}
            </Flex>
            <RichTextEditor
              content={content}
              editable={isEdit}
              setContent={setContent}
            />
            {isEdit ? (
              <Flex justifyContent="space-between">
                <Flex justifyContent="center" alignItems="center">
                  <Text mr="5">Скрыть?</Text>
                  <Switch
                    defaultChecked={lesson.isHidden}
                    onChange={handleHiddenChange}
                  />
                </Flex>
                <Button onClick={handleSave} colorScheme="blue">
                  Сохранить
                </Button>
              </Flex>
            ) : null}
          </Stack>
          <Divider my="5" />
          <Stack
            width="full"
            divider={<StackDivider borderColor="gray.200" />}
            spacing={4}
            align="stretch"
          >
            <Heading
              color={themedColor}
              fontSize={"2xl"}
              fontFamily={"body"}
              alignSelf="center"
            >
              Список тестов
            </Heading>
            {testsError ? (
              <ErrorResult title="Произошла ошибка при получении тестов!" />
            ) : !tests || tests.length === 0 ? (
              <InfoResult title="Тестов ещё нет" />
            ) : (
              <TestList tests={tests} />
            )}
          </Stack>
          {isOwner ? <LessonFooter lesson={lesson} /> : null}
        </>
      )}
    </Flex>
  );
};

type LessonFooterProps = {
  lesson: Lesson;
};

const LessonFooter = ({ lesson }: LessonFooterProps) => {
  return (
    <Box textAlign="center" mt="10">
      <Button
        as={RouterLink}
        to="/create-test"
        state={{ lessonId: lesson.id }}
        bg="blue.600"
        _hover={{ background: "blue.400" }}
        color="white"
        variant="solid"
      >
        Создать тест
      </Button>
    </Box>
  );
};
