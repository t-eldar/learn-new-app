import { QuestionForm } from "@/components/forms/question-form";
import { QuestionList } from "@/components/question-list";
import { useAuthentication } from "@/hooks/use-authentication";
import { createTest } from "@/services/test-service";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { EmptyQuestion } from "@/types/models";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";

export const CreateTestPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const location = useLocation();
  const navigate = useNavigate();
  const { authUser } = useAuthentication() ?? { authUser: undefined };
  if (!location.state.lessonId || !authUser) {
    navigate("/");
    return <></>;
  }

  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState<EmptyQuestion>(null!);
  const [questions, setQuestions] = useState<EmptyQuestion[]>([]);

  useEffect(() => {
    if (!question) {
      return;
    }
    setQuestions([...questions, question]);
  }, [question]);

  const { error: testError, refetch: create } = useQuery(
    "create-test",
    async () =>
      await createTest({
        title,
        userId: authUser.id,
        lessonId: location.state.lessonId,
        questions
      }),
    { enabled: false, refetchOnWindowFocus: false }
  );

  /// handlers
  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
  };
  const handleCreate: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    create();
  }

  return (
    <>
      <Heading
        marginY="3"
        bgGradient="linear(to-r, blue.400, blue.600)"
        backgroundClip="text"
      >
        Создание теста
      </Heading>
      <FormControl>
        <FormLabel>
          <Text>Название</Text>
        </FormLabel>
        <Input width="50%" value={title} onChange={handleTitleChange} />
      </FormControl>
      {!!questions ? <QuestionList questions={questions} /> : null}
      <Box>
        <Button my="4" colorScheme="blue" onClick={onOpen}>
          Добавить вопрос
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <Box m="10">
              <QuestionForm
                onCreate={onClose}
                question={question}
                setQuestion={setQuestion}
              />
            </Box>
          </ModalContent>
        </Modal>
      </Box>
      <Footer onCreate={handleCreate} />
    </>
  );
};

type FooterProps = {
  onCreate: React.MouseEventHandler<HTMLButtonElement>;
};

const Footer = ({ onCreate }: FooterProps) => {
  return (
    <Box textAlign="center">
      <Button
        onClick={onCreate}
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
