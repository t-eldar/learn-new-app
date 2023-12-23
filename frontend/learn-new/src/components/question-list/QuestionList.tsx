import { CheckCircleIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { Box, Divider, Flex, Stack, Text } from "@chakra-ui/react";
import { EmptyQuestion } from "@/types/models";
import React from "react";

type QuestionListProps<TQuestion extends EmptyQuestion> = {
  questions: TQuestion[];
};

export const QuestionList = <TQuestion extends EmptyQuestion>({
  questions,
}: QuestionListProps<TQuestion>) => {
  return (
    <Box>
      {questions.map((q, i) => (
        <QuestionItem key={i} question={q} />
      ))}
    </Box>
  );
};

type QuestionItemProps<TQuestion extends EmptyQuestion> = {
  question: TQuestion;
};
const QuestionItem = <TQuestion extends EmptyQuestion>({
  question,
}: QuestionItemProps<TQuestion>) => {
  return (
    <Box>
      <Text fontSize="2xl" color="blue.300">
        {question.content}
      </Text>
      {question.areAnswersChoicable ? (
        <>
          <Box alignSelf="center" fontSize="xl">
            Варианты ответа
          </Box>
          {question.answers.map((a, j) => (
            <Box key={j}>
              <Flex alignItems="center" justifyContent="space-between" mr="5">
                <Text>{a.text}</Text>
                {a.isCorrect ? <CheckCircleIcon /> : <SmallCloseIcon />}
              </Flex>
              <Divider />
            </Box>
          ))}
        </>
      ) : (
        <Flex>
          <Stack>
            <Text fontSize="xl">Правильный ответ</Text>
            <Text>{question.answers[0].text}</Text>
          </Stack>
        </Flex>
      )}
    </Box>
  );
};
