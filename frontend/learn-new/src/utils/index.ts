import isUrl from "is-url";
import {
  Descendant,
  Editor,
  Element,
  ElementTypes,
  TextFormats,
  Transforms,
} from "slate";
import imageExtensions from "image-extensions";
import { AudioElement, ImageElement, VideoELement } from "../types/slate";

const listTypes = ["numbered-list", "bulleted-list"];

export const EditorHelpers = {
  isBlockActive(editor: Editor, format: ElementTypes) {
    const nodeGen = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === format,
    });

    let node = nodeGen.next();
    while (!node.done) {
      return true;
    }
    return false;
  },

  isMarkActive(editor: Editor, format: TextFormats) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },

  toggleBlock(editor: Editor, format: ElementTypes) {
    const isActive = this.isBlockActive(editor, format);
    const isList = listTypes.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        listTypes.includes(
          (!Editor.isEditor(n) && Element.isElement(n) && n.type) as string
        ),
      split: true,
    });
    const newProperties: Partial<Element> = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, children: [] as Descendant[] } as Element;

      Transforms.wrapNodes(editor, block);
    }
  },

  toggleMark(editor: Editor, format: TextFormats) {
    const isActive = this.isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  },

  insertImage(
    editor: Editor,
    url: string,
    onError?: (message: string) => void
  ) {
    if (url && !isImageUrl(url) && onError) {
      onError("Неверная ссылка");
      return;
    }
    const text = { text: "" };
    const image = {
      type: "image",
      source: url,
      alternative: "image",
      children: [text],
    } satisfies ImageElement;

    Transforms.insertNodes(editor, image);
  },
  insertVideo(
    editor: Editor,
    url: string,
    onError?: (message: string) => void
  ) {
    const text = { text: "" };
    const id = getYouTubeVideoId(url);
    if (url && !id) {
      if (onError) {
        onError("Неверная ссылка");
      }
      return;
    }
    const video = {
      type: "video",
      source: url,
      videoId: id!,
      children: [text],
    } satisfies VideoELement;

    Transforms.insertNodes(editor, video);
  },
  insertAudio(
    editor: Editor,
    url: string,
    onError?: (message: string) => void
  ) {
    const text = { text: "" };
    const audio = {
      type: "audio",
      source: url,
      children: [text],
    } satisfies AudioElement;

    Transforms.insertNodes(editor, audio);
  },
};

export const isImageUrl = (url: string) => {
  if (!url) {
    return false;
  }
  if (!isUrl(url)) {
    return false;
  }
  const ext = new URL(url).pathname.split(".").pop() ?? "";

  return imageExtensions.includes(ext);
};

export const getYouTubeVideoId = (url: string) => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : null;
};

export const combineURLs = (...urls: string[]) =>
  urls
    .join("/")
    .replace(/[\/]+/g, "/")
    .replace(/^(.+):\//, "$1://")
    .replace(/^file:/, "file:/")
    .replace(/\/(\?|&|#[^!])/g, "$1")
    .replace(/\?/g, "&");
