import { Box, Divider, Flex, Radio, RadioGroup, Text } from "@chakra-ui/react";
import { Answer, EmptyAnswer } from "models";

type AnswerListProps<TAnswer extends EmptyAnswer> = {
  answers: TAnswer[];
  setAnswers: React.Dispatch<React.SetStateAction<TAnswer[]>>;
};

export const AnswerList = <TAnswer extends EmptyAnswer>({
  answers,
  setAnswers,
}: AnswerListProps<TAnswer>) => {
  const handleCorrectChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const checked = answers.find((a) => a.text === e.target.value);
    console.log(checked);

    if (!checked) {
      return;
    }

    const copy = [...answers];
    const index = copy.indexOf(checked);
    copy[index] = { ...checked, isCorrect: true };

    console.log(copy);

    setAnswers([...copy]);
  };

  return (
    <>
      <RadioGroup>
        {answers.map((a, i) => (
          <Box key={i}>
            <Flex justifyContent="space-between" alignItems="center">
              <Text>{a.text}</Text>
              <Radio value={a.text} onChange={handleCorrectChange} />
            </Flex>
          </Box>
        ))}
      </RadioGroup>
    </>
  );
};
