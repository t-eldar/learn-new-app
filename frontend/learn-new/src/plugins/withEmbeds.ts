import { Editor } from "slate";
import { EditorHelpers, isImageUrl } from "../utils";

export const withEmbeds = (editor: Editor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ||
      element.type === "video" ||
      element.type === "audio"
      ? true
      : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result as string;
            EditorHelpers.insertImage(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      EditorHelpers.insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};
