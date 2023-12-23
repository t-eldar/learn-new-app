import { InfoIcon } from "@chakra-ui/icons";
import { Result } from "../result";

type InfoProps = {
  title: string;
  message?: string;
};

export const InfoResult = ({ title, message }: InfoProps) => {
  return (
    <Result
      title={title}
      message={message}
      icon={<InfoIcon boxSize={"50px"} color={"blue.500"} />}
    />
  );
};
