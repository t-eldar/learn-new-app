import { IconButton } from "@chakra-ui/react";
import { ReactElement } from "react";
import { TextFormats } from "slate";
import { useSlate } from "slate-react";
import { EditorHelpers } from "@/utils";

type MarkButtonProps = {
  format: TextFormats;
  icon: ReactElement;
};

export const MarkButton = ({ format, icon }: MarkButtonProps) => {
  const editor = useSlate();
  return (
    <IconButton
      variant="outline"
      colorScheme="blue"
      isActive={EditorHelpers.isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        EditorHelpers.toggleMark(editor, format);
      }}
      aria-label={format}
      icon={icon}
      borderWidth={0}
      fontSize={"20px"}
    />
  );
};
