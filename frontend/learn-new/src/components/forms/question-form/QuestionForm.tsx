import { useState } from "react";

import {
  Box,
  BoxProps,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Switch,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { EmptyAnswer, EmptyQuestion } from "@/types/models";
import { AnswerList } from "@/components/answer-list";

type QuestionFormProps<TQuestion extends EmptyQuestion> = {
  onCreate: () => void;
  question: TQuestion;
  setQuestion: React.Dispatch<React.SetStateAction<TQuestion>>;
};

export const QuestionForm = <TQuestion extends EmptyQuestion>({
  onCreate,
  question,
  setQuestion,
}: QuestionFormProps<TQuestion>) => {
  const [content, setContent] = useState("");
  const [areAnswersChoicable, setAreAnswersChoicable] = useState(false);
  const [answers, setAnswers] = useState<EmptyAnswer[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<EmptyAnswer>();

  const [addingText, setAddingText] = useState("");
  const [addingCorrectText, setAddingCorrectText] = useState("");

  // handlers

  const handleAddingTextChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    e.preventDefault();
    setAddingText(e.target.value);
  };
  const handleAddingCorrectTextChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    e.preventDefault();
    setAddingCorrectText(e.target.value);
  };

  const handleCorrectAnswerAdd: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.preventDefault();
    setCorrectAnswer({ text: addingCorrectText, isCorrect: true });
  };

  const handleAnswerAdd: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (answers.find((a) => a.text === addingText) || addingText.length === 0) {
      return;
    }
    setAnswers([...answers, { text: addingText, isCorrect: false }]);
  };

  const handleContentChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    e.preventDefault();
    setContent(e.target.value);
  };
  const handleChoicableChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setAreAnswersChoicable(e.target.checked);
  };

  const handleQuestionCreate: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.preventDefault();
    if (areAnswersChoicable) {
      setQuestion({
        ...question,
        content,
        areAnswersChoicable,
        answers,
      });
    } else {
      if (!correctAnswer) {
        return;
      }
      setQuestion({
        ...question,
        content,
        areAnswersChoicable,
        answers: [correctAnswer],
      });
    }
    onCreate();
  };

  return (
    <Box>
      <Heading
        marginY="3"
        bgGradient="linear(to-r, blue.400, blue.600)"
        backgroundClip="text"
      >
        Создание вопроса
      </Heading>
      <FormControl>
        <FormLabel>Вопрос</FormLabel>
        <Textarea value={content} onChange={handleContentChange} />
      </FormControl>
      <FormControl display="flex" my="4" alignItems="center">
        <FormLabel>С вариантами ответов</FormLabel>
        <Switch defaultChecked={false} onChange={handleChoicableChange} />
      </FormControl>
      {areAnswersChoicable ? (
        <Box>
          {!!answers ? (
            <AnswerList answers={answers} setAnswers={setAnswers} />
          ) : null}
          <AddAnswer
            text="Вариант ответа"
            my="4"
            value={addingText}
            onChange={handleAddingTextChange}
            onAdd={handleAnswerAdd}
          />
        </Box>
      ) : (
        <Box>
          <AddAnswer
            text="Правильный ответ"
            my="4"
            value={addingCorrectText}
            onChange={handleAddingCorrectTextChange}
            onAdd={handleCorrectAnswerAdd}
          />
        </Box>
      )}
      <Flex>
        <Button colorScheme="blue" onClick={handleQuestionCreate}>
          Создать вопрос
        </Button>
      </Flex>
    </Box>
  );
};

type AddAnswerProps = BoxProps & {
  text: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onAdd: React.MouseEventHandler<HTMLButtonElement>;
};
const AddAnswer = ({
  text,
  value,
  onChange,
  onAdd,
  ...rest
}: AddAnswerProps) => (
  <Box {...rest}>
    <Text>{text}</Text>
    <Flex my="4" alignItems="center">
      <Input type="text" value={value} onChange={onChange} />
      <Button ml="4" type="button" onClick={onAdd} colorScheme="blue">
        Добавить
      </Button>
    </Flex>
  </Box>
);
