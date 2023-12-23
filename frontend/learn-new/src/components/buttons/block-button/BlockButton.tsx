import { IconButton } from "@chakra-ui/react";
import { ReactElement } from "react";
import { ElementTypes } from "slate";
import { useSlate } from "slate-react";
import { EditorHelpers } from "@/utils";

type BlockButtonProps = {
  format: ElementTypes;
  icon: ReactElement;
};

export const BlockButton = ({ format, icon }: BlockButtonProps) => {
  const editor = useSlate();
  return (
    <IconButton
      variant="outline"
      colorScheme="blue"
      isActive={EditorHelpers.isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        EditorHelpers.toggleBlock(editor, format);
      }}
      aria-label={format}
      icon={icon}
      borderWidth={0}
      fontSize={"20px"}
    />
  );
};
