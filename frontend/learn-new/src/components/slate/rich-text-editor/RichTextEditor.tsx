import {
  useState,
  useRef,
  KeyboardEvent,
  useCallback,
  MouseEvent,
} from "react";

import {
  withReact,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  Editable,
} from "slate-react";

import {
  Editor,
  Transforms,
  createEditor,
  Node,
  Element,
  TextFormats,
  Descendant,
} from "slate";
import { withHistory } from "slate-history";

import isHotkey from "is-hotkey";

import { Box } from "@chakra-ui/react";

import { EditorHelpers } from "@/utils";
import { withEmbeds } from "@/plugins/withEmbeds";
import { RenderElement } from "@/components/slate/render-element";
import { Leaf } from "@/components/slate/leaf";
import { Toolbar } from "@/components/slate/toolbar";

const HOTKEYS: Record<string, TextFormats> = {
  "ctrl+b": "bold",
  "ctrl+i": "italic",
  "ctrl+u": "underline",
  "ctrl+`": "code",
};

export type RichTextEditorProps =
  | {
      content: string;
      editable: false;
    }
  | {
      content: string;
      editable: true;
      setContent: React.Dispatch<React.SetStateAction<string>>;
    };

export const RichTextEditor = ({
  content,
  editable,
  ...rest
}: RichTextEditorProps) => {
  let initialValue: Element[];
  if (content.length === 0) {
    initialValue = [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ];
  } else {
    initialValue = JSON.parse(content) as Element[];
  }

  const [value, setValue] = useState<Node[]>(initialValue);
  const [editor] = useState(() =>
    withEmbeds(withHistory(withReact(createEditor())))
  );

  const renderElement = useCallback(
    (props: RenderElementProps) => <RenderElement {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  const [focused, setFocused] = useState(false);
  const savedSelection = useRef(editor.selection);

  const onFocus = useCallback(() => {
    setFocused(true);
    if (!editor.selection && value?.length) {
      Transforms.select(
        editor,
        savedSelection.current ?? Editor.end(editor, [])
      );
    }
  }, [editor]);

  const onBlur = useCallback(() => {
    setFocused(false);
    savedSelection.current = editor.selection;
  }, [editor]);

  const divRef = useRef<HTMLDivElement>(null);

  const focusEditor = useCallback(
    (event: MouseEvent) => {
      if (event.target === divRef.current) {
        ReactEditor.focus(editor);
        event.preventDefault();
      }
    },
    [editor]
  );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();

        const mark = HOTKEYS[hotkey];
        EditorHelpers.toggleMark(editor, mark);
      }
    }
  };

  return (
    <Box ref={divRef} rounded="xl" onMouseDown={focusEditor} borderWidth={"1px"}>
      <Slate
        editor={editor}
        value={value as Descendant[]}
        onChange={(newValue) => {
          if ("setContent" in rest) {
            rest.setContent(JSON.stringify(newValue));
          }
          setValue(newValue);
        }}
      >
        {editable ? (
          <Box>
            <Toolbar />
          </Box>
        ) : null}
        <Box padding={"15px 5px"} rounded="xl">
          <Editable
            readOnly={!editable}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Введите текст…"
            spellCheck
            style={{
              padding: "1rem",
              borderRadius: 20,
              height: "fit-content",
              minHeight: "150px",
              resize: editable ? "vertical" : "none",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          />
        </Box>
      </Slate>
    </Box>
  );
};
