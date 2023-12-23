import { CloseIcon } from "@chakra-ui/icons";
import { Result } from "../result";

type ErrorProps = {
  title: string;
  message?: string;
};

export const ErrorResult = ({ title, message }: ErrorProps) => {
  return (
    <Result
      title={title}
      message={message}
      icon={<CloseIcon boxSize={"55px"} color={"red.500"} />}
    />
  );
};
