import { HStack } from "@chakra-ui/react";
import {
  MdAudioFile,
  MdAudiotrack,
  MdCode,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatUnderlined,
  MdImage,
  MdLooksOne,
  MdLooksTwo,
} from "react-icons/md";
import { GrYoutube } from "react-icons/gr";
import { EditorHelpers } from "@/utils";
import { BlockButton } from "@/components/buttons/block-button";
import { InsertButton } from "@/components/buttons/insert-button/InsertButton";
import { MarkButton } from "@/components/buttons/mark-button/MarkButton";

export const Toolbar = () => {
  return (
    <HStack
      borderWidth={"0 0 1px 0"}
      padding={"10px 5px"}
      spacing={"5px"}
      wrap={"wrap"}
    >
      <MarkButton format="bold" icon={<MdFormatBold />} />
      <MarkButton format="italic" icon={<MdFormatItalic />} />
      <MarkButton format="underline" icon={<MdFormatUnderlined />} />
      <MarkButton format="code" icon={<MdCode />} />
      <BlockButton format="heading-one" icon={<MdLooksOne />} />
      <BlockButton format="heading-two" icon={<MdLooksTwo />} />
      <BlockButton format="block-quote" icon={<MdFormatQuote />} />
      <BlockButton format="numbered-list" icon={<MdFormatListNumbered />} />
      <BlockButton format="bulleted-list" icon={<MdFormatListBulleted />} />
      <InsertButton
        format="image"
        icon={<MdImage />}
        insert={EditorHelpers.insertImage}
      />
      <InsertButton
        format="video"
        icon={<GrYoutube />}
        insert={EditorHelpers.insertVideo}
      />
      <InsertButton
        format="audio"
        icon={<MdAudiotrack />}
        insert={EditorHelpers.insertAudio}
      />
    </HStack>
  );
};
