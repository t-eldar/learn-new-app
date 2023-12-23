import { RichTextEditor } from "@/components/slate/rich-text-editor";
import { useAuthentication } from "@/hooks/use-authentication";
import { createLesson } from "@/services/lesson-service";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";

export const CreateLessonPage = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const toast = useToast();
  const { authUser } = useAuthentication() ?? { authUser: undefined };
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state.courseId || !authUser) {
    navigate("/");
    return <></>;
  }

  const { error, refetch: create } = useQuery(
    "create-lesson",
    async () => {
      await createLesson({
        isHidden: false,
        title,
        content,
        courseId: location.state.courseId,
        userId: authUser.id,
      });
    },
    { refetchOnWindowFocus: false, enabled: false }
  );
  useEffect(() => {
    if (error) {
      toast({
        status: "error",
        title: "Ошибка создания!",
        isClosable: true,
      });
    }
  }, [error]);

  const handleCreate = () => {
    if (content.length === 0) {
      toast({
        status: "error",
        title: "Введите текст!",
        isClosable: true,
      });
      return;
    }
    create();
  };
  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
  };
  return (
    <>
      <FormControl mb="3">
        <FormLabel fontSize="2xl">Название</FormLabel>
        <Input value={title} onChange={handleTitleChange} />
      </FormControl>
      <RichTextEditor
        content={content}
        editable={true}
        setContent={setContent}
      />
      <Divider my="6" />
      <Box textAlign="center">
        <Button
          onClick={handleCreate}
          bg="blue.600"
          _hover={{ background: "blue.400" }}
          color="white"
          variant="solid"
        >
          Создать
        </Button>
      </Box>
    </>
  );
};
