import { Toolbar } from "@liveblocks/react-tiptap";
import { Editor } from "@tiptap/react";
import { CheckboxIcon } from "@/app/docs/icons";
import styles from "./Toolbar.module.css";

type Props = {
  editor: Editor | null;
};

export function ToolbarBlockSelector({ editor }: Props) {
  // Guard against null editor to prevent hydration issues
  if (!editor) {
    return null;
  }

  return (
    <Toolbar.BlockSelector
      className={styles.blockSelector}
      items={(defaultBlockItems) => [
        ...defaultBlockItems,
        {
          name: "Task list",
          icon: <CheckboxIcon style={{ width: 17 }} />,
          isActive: () => editor?.isActive("taskList") ?? false,
          setActive: () => editor?.chain().focus().toggleTaskList().run(),
        },
      ]}
    />
  );
}
