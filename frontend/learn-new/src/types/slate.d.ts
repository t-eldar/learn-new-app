import { BaseEditor, BaseElement, BaseText } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

type CustomElement =
  | ParagraphElement
  | InsertableElement
  | BlockQuoteElement
  | ListItemElement
  | ListElement
  | HeadingOneElement
  | HeadingTwoElement;

export type ParagraphElement = BaseElement & { type: "paragraph" };
export type BlockQuoteElement = BaseElement & { type: "block-quote" };
export type ListItemElement = BaseElement & { type: "list-item" };
export type HeadingOneElement = BaseElement & { type: "heading-one" };
export type HeadingTwoElement = BaseElement & { type: "heading-two" };

type ListElement = NumberedListElement | BulletedListElement;
export type NumberedListElement = BaseElement & { type: "numbered-list" };
export type BulletedListElement = BaseElement & { type: "bulleted-list" };

type InsertableElement = ImageElement | VideoELement | AudioElement;
type MediaElement = BaseElement & { source: string };
export type AudioElement = MediaElement & {
  type: "audio";
};
export type VideoELement = MediaElement & {
  type: "video";
  videoId: string;
};
export type ImageElement = MediaElement & {
  type: "image";
  alternative: string;
};

type CustomText = BaseText & {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  underline?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
  type ElementTypes = CustomElement["type"];
  type TextFormats = Exclude<keyof CustomText, "text">;
  type InsertFormats = InsertableElement["type"];
}
