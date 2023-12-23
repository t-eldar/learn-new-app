import { useState, useEffect, ReactElement, MouseEventHandler } from "react";

import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useSlate } from "slate-react";
import { Editor, InsertFormats } from "slate";
import { MdCheck } from "react-icons/md";

type InsertButtonProps = {
  format: InsertFormats;
  icon: ReactElement;
  insert: (e: Editor, url: string, onError?: (message: string) => void) => void;
};

export const InsertButton = ({ icon, format, insert }: InsertButtonProps) => {
  const { onClose } = useDisclosure();
  const toast = useToast();
  const editor = useSlate();
  const [input, setInput] = useState("");

  const handleClick: MouseEventHandler = (event) => {
    event.preventDefault();
    if (input) {
      insert(editor, input, (s) =>
        toast({
          title: s,
          status: "error",
        })
      );
      setInput("");
      onClose();
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          variant="outline"
          colorScheme="blue"
          aria-label={format}
          icon={icon}
          borderWidth={0}
          fontSize={"20px"}
        />
      </PopoverTrigger>
      <PopoverContent>
        <FormControl padding={3}>
          <FormLabel>Введите ссылку</FormLabel>
          <Input
            type="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button width="100%" onMouseDown={handleClick}>
            <MdCheck />
          </Button>
        </FormControl>
      </PopoverContent>
    </Popover>
  );
};
