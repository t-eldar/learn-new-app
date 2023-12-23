import { CSSProperties } from "react";

import {
  chakra,
  Heading,
  Image,
  ListItem,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
import { RenderElementProps, useFocused, useSelected } from "slate-react";
import { AudioElement, ImageElement, VideoELement } from "@/types/slate";
import YouTube from "react-youtube";
import { getYouTubeVideoId } from "@/utils";

const BlockquoteStyle: CSSProperties | undefined = {
  margin: "1.5em 10px",
  padding: "0.5em 10px",
};

export const RenderElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case "block-quote":
      return (
        <chakra.blockquote
          style={BlockquoteStyle}
          borderLeftWidth={"10px"}
          borderLeftColor={"gray.200"}
          {...attributes}
        >
          {children}
        </chakra.blockquote>
      );
    case "list-item":
      return <ListItem {...attributes}>{children}</ListItem>;
    case "numbered-list":
      return <OrderedList {...attributes}>{children}</OrderedList>;
    case "bulleted-list":
      return <UnorderedList {...attributes}>{children}</UnorderedList>;
    case "heading-one":
      return (
        <Heading as="h1" size="3xl" {...attributes}>
          {children}
        </Heading>
      );
    case "heading-two":
      return (
        <Heading as="h2" size="2xl" {...attributes}>
          {children}
        </Heading>
      );
    case "image":
      return <ImageRenderElement {...props} />;
    case "video":
      return <VideoRenderElement {...props} />;
    case "audio":
      return <AudioRenderElement {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const ImageRenderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const imageElement = element as ImageElement;
  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      {children}
      <div
        contentEditable={false}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <Image
          borderRadius={10}
          src={imageElement.source}
          alt={imageElement.alternative}
          style={{
            boxShadow: `${selected && focused ? "0 0 0 3px #B4D5FF" : "none"}`,
          }}
        />
      </div>
    </div>
  );
};

const VideoRenderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const { source } = element as VideoELement;
  const videoId = getYouTubeVideoId(source);

  if (!videoId) {
    return null;
  }
  return (
    <div {...attributes}>
      {children}
      <div
        contentEditable={false}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <YouTube videoId={videoId} />
      </div>
    </div>
  );
};

const AudioRenderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const audioElement = element as AudioElement;
  return (
    <div {...attributes}>
      {children}
      <div
        contentEditable={false}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <chakra.audio src={audioElement.source} controls />
      </div>
    </div>
  );
};
