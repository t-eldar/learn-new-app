import { ErrorResult } from "@/components/error-result";
import { InfoResult } from "@/components/info-result";
import { useAuthentication } from "@/hooks/use-authentication";
import { getCorrectAnswersByTestId } from "@/services/answer-service";
import { checkTest } from "@/services/check-test-service";
import { getQuestionScoresByTestScoreId } from "@/services/question-score-service";
import { getTestScoreByUserAndTestId } from "@/services/test-score-service";
import { getTestById } from "@/services/test-service";
import {
  Icon,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  Answer,
  CheckTestRequest,
  Question,
  QuestionScore,
  UserAnswerRequest,
} from "@/types/models";
import { useEffect, useState, useMemo } from "react";
import { MdDoNotDisturbAlt, MdTaskAlt } from "react-icons/md";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

export const TestPage = () => {
  const { authUser } = useAuthentication() ?? { authUser: undefined };
  const params = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const id = Number(params.testId);

  useEffect(() => {
    if (!id) {
      toast({ status: "error", title: "Произошла ошибка!" });
      navigate("/");
    }
  }, [id, authUser]);

  const { data: test, error: testError } = useQuery(
    ["test", id],
    async () => await getTestById(id),
    { refetchOnWindowFocus: false }
  );
  const {
    data: testScore,
    refetch: getTestScore,
    error: testScoreError,
  } = useQuery(
    ["test-score", id, authUser!.id],
    async () => {
      if (!authUser) {
        return;
      }
      const result = await getTestScoreByUserAndTestId(authUser.id, test!.id);
      return result;
    },
    { refetchOnWindowFocus: false, retry: 1, enabled: !!test }
  );

  return (
    <>
      {!!testError ? (
        <ErrorResult title="Произошла ошибка при получении теста!" />
      ) : !test ? (
        <InfoResult title="Тест не найден!" />
      ) : (
        <>
          <Box>
            <Heading textAlign="center">{test.title}</Heading>
          </Box>
          {!testScore || testScoreError ? (
            <NotCompletedQuestionsBlock
              onCheck={async () => await getTestScore()}
              testId={test.id}
              userId={authUser!.id}
              questions={test.questions}
            />
          ) : (
            <CompletedQuestionsBlock
              testScoreId={testScore.id}
              testId={test.id}
              userId={authUser!.id}
            />
          )}
        </>
      )}
    </>
  );
};

type NotCompletedQuestionsBlockProps = {
  testId: number;
  userId: string;
  questions: Question[] | undefined;
  onCheck?: () => void;
};

const NotCompletedQuestionsBlock = ({
  testId,
  questions,
  userId,
  onCheck,
}: NotCompletedQuestionsBlockProps) => {
  const [userAnswers, setUserAnswers] = useState<UserAnswerRequest[]>([]);

  const {
    data,
    error,
    refetch: check,
  } = useQuery(
    ["check-test", userId, testId],
    async () => {
      await checkTest({
        testId,
        answerRequests: userAnswers,
      } satisfies CheckTestRequest);
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  const handleCheckTest: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    check();
    if (onCheck) {
      onCheck();
    }
  };

  return (
    <Box>
      {!questions ? (
        <InfoResult title="Вопросы не найдены!" />
      ) : (
        <>
          {questions.map((q, i) => (
            <NotCompletedQuestionItem
              userId={userId}
              userAnswers={userAnswers}
              setUserAnswers={setUserAnswers}
              key={i}
              question={q}
            />
          ))}
          <Box textAlign="center" mt="10">
            <Button
              onClick={handleCheckTest}
              bg="blue.600"
              _hover={{ background: "blue.400" }}
              color="white"
              variant="solid"
            >
              Завершить тестрование
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

type NotCompletedQuestionItemProps = {
  userId: string;
  question: Question;
  userAnswers: UserAnswerRequest[];
  setUserAnswers: React.Dispatch<React.SetStateAction<UserAnswerRequest[]>>;
};
const NotCompletedQuestionItem = ({
  userId,
  question,
  userAnswers,
  setUserAnswers,
}: NotCompletedQuestionItemProps) => {
  const color = useColorModeValue("gray.300", "gray.800");

  const [text, setText] = useState("");

  const handleTextChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setText(e.target.value);
  };

  useEffect(() => {
    handleAnswerAdd();
  }, [text]);

  useEffect(() => {
    console.log(userAnswers);
  }, [userAnswers]);

  const handleAnswerChoose: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    e.preventDefault();
    console.log(e.target.value);

    setText(e.target.value);
  };

  const handleAnswerAdd = () => {
    const item = userAnswers.find((a) => a.questionId === question.id);
    console.log(item);

    if (!item) {
      setUserAnswers([
        ...userAnswers,
        { answerText: text, questionId: question.id, userId },
      ]);
    } else {
      const copy = userAnswers.filter((a) => a.questionId !== question.id);
      setUserAnswers([...copy, { ...item, answerText: text }]);
    }
  };

  return (
    <Box rounded="2xl" bg={color} my="5" p="5">
      <Text fontSize="xl">{question.content}</Text>
      <Divider my="4" />
      {question.areAnswersChoicable ? (
        <Flex justifyContent="center" alignItems="center">
          <RadioGroup width="100%">
            {question.answers!.map((a, i) => (
              <Box key={i}>
                <Flex justifyContent="space-between">
                  <Text>{a.text}</Text>
                  <Radio value={a.text} onChange={handleAnswerChoose} />
                </Flex>
              </Box>
            ))}
          </RadioGroup>
        </Flex>
      ) : (
        <Box>
          <Input
            placeholder="Введите ответ..."
            value={text}
            onChange={handleTextChange}
          />
        </Box>
      )}
    </Box>
  );
};

type CompletedQuestionsBlockProps = {
  testScoreId: number;
  testId: number;
  userId: string;
};

const CompletedQuestionsBlock = ({
  testId,
  userId,
  testScoreId,
}: CompletedQuestionsBlockProps) => {
  const color = useColorModeValue("gray.300", "gray.800");

  const { data: questionScores, error: scoresError } = useQuery(
    ["question-scores", testId, userId],
    async () => {
      const result = await getQuestionScoresByTestScoreId(testScoreId);

      return result;
    },
    { refetchOnWindowFocus: false }
  );
  const { data: correctAnswers, error: correctsError } = useQuery(
    ["correct-answers", testId],
    async () => {
      const result = await getCorrectAnswersByTestId(testId);

      return result;
    },
    { refetchOnWindowFocus: false }
  );

  return (
    <Box>
      {!questionScores || !correctAnswers ? (
        !!scoresError || !!correctsError ? (
          <ErrorResult title="Произошла ошибка!" />
        ) : (
          <InfoResult title="Загрузка ошибка!" />
        )
      ) : (
        <>
          <CompletedQuestionsList
            questionScores={questionScores}
            correctAnswers={correctAnswers}
          />
          <Flex justifyContent="center" rounded="xl" my="5" p="5" bg={color}>
            <>
              <Text mr="5">Набранные баллы: </Text>
              <Text>{questionScores[0].testScore?.score}</Text>
            </>
          </Flex>
        </>
      )}
    </Box>
  );
};

type CompletedQuestionsListProps = {
  questionScores: QuestionScore[];
  correctAnswers: Answer[];
};

const CompletedQuestionsList = ({
  questionScores,
  correctAnswers,
}: CompletedQuestionsListProps) => {
  const list = useMemo(() => {
    return correctAnswers.map((a) => {
      const qs = questionScores.find((s) => s.questionId === a.questionId);

      return { questionScore: qs, correctAnswer: a };
    });
  }, [correctAnswers, questionScores]);

  return (
    <Box>
      {list.map((v, i) => (
        <CompletedQuesionItem
          key={i}
          questionScore={v.questionScore!}
          correctAnswer={v.correctAnswer}
        />
      ))}
    </Box>
  );
};

type CompletedQuesionItemProps = {
  questionScore: QuestionScore;
  correctAnswer: Answer;
};

const CompletedQuesionItem = ({
  questionScore,
  correctAnswer,
}: CompletedQuesionItemProps) => {
  const color = useColorModeValue("gray.300", "gray.800");

  return (
    <Box rounded="2xl" bg={color} my="5" p="5">
      <Text fontSize="xl">
        {questionScore.question?.content ?? "Ошибка получения вопроса!"}
      </Text>
      <Divider mt="5" bgColor={"gray.900"} />
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Flex>
            <Text mr="5">Ваш ответ: </Text>
            <Text fontStyle="italic"> {questionScore.userAnswerText}</Text>
          </Flex>

          <Flex>
            <Text mr="5">Правильный ответ: </Text>
            <Text fontStyle="italic"> {correctAnswer.text}</Text>
          </Flex>
        </Box>
        <Box m="1">
          {questionScore.isCorrect ? (
            <Icon as={MdTaskAlt} boxSize={"30px"} color="green.400" />
          ) : (
            <Icon as={MdDoNotDisturbAlt} boxSize={"30px"} color="red.400" />
          )}
        </Box>
      </Flex>
    </Box>
  );
};
