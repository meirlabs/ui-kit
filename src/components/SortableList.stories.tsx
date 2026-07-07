import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SortableList, SortableHandle } from "./SortableList";
import { Badge } from "./Badge";
// Not part of styles/index.css — the /sortable subpath owns its own CSS.
import "../styles/sortable.css";

const meta: Meta<typeof SortableList> = {
  title: "Data Display/SortableList",
  component: SortableList,
};
export default meta;

interface Task {
  id: string;
  title: string;
  tone?: "neutral" | "success" | "warning";
  status?: string;
}

const initialTasks: Task[] = [
  { id: "brief", title: "Write launch brief", tone: "success", status: "Done" },
  { id: "copy", title: "Review landing copy", tone: "warning", status: "In review" },
  { id: "assets", title: "Export social assets" },
  { id: "email", title: "Draft announcement email" },
  { id: "qa", title: "Final QA pass" },
];

/**
 * Whole-row drag (default). Drag anywhere on a row, or focus a row and use
 * Space to lift, ArrowUp/ArrowDown to move, Space to drop, Escape to cancel.
 */
export const Basic: StoryObj = {
  render: () => {
    const [tasks, setTasks] = useState(initialTasks);
    return (
      <div style={{ maxWidth: 420 }}>
        <SortableList
          items={tasks}
          onReorder={setTasks}
          renderItem={(task) => (
            <>
              <span style={{ flex: 1 }}>{task.title}</span>
              {task.status && <Badge tone={task.tone}>{task.status}</Badge>}
            </>
          )}
          aria-label="Launch tasks"
        />
      </div>
    );
  },
};

/**
 * Explicit handle mode: only the grip starts a drag, so row content stays
 * freely clickable and selectable.
 */
export const WithHandle: StoryObj = {
  render: () => {
    const [tasks, setTasks] = useState(initialTasks);
    return (
      <div style={{ maxWidth: 420 }}>
        <SortableList
          items={tasks}
          onReorder={setTasks}
          handle
          renderItem={(task, { dragHandleProps }) => (
            <>
              <SortableHandle
                {...dragHandleProps}
                aria-label={`Reorder ${task.title}`}
              />
              <span style={{ flex: 1 }}>{task.title}</span>
              {task.status && <Badge tone={task.tone}>{task.status}</Badge>}
            </>
          )}
          aria-label="Launch tasks"
        />
      </div>
    );
  },
};

/** Hebrew announcements for HE surfaces — strings only, layout unchanged. */
export const HebrewAnnouncements: StoryObj = {
  render: () => {
    const [tasks, setTasks] = useState(initialTasks);
    return (
      <div style={{ maxWidth: 420 }} dir="rtl">
        <SortableList
          items={tasks}
          onReorder={setTasks}
          announcements={{
            roleDescription: "ניתן למיון",
            instructions:
              "להרמת פריט לחצו רווח או אנטר. בזמן גרירה השתמשו בחצים " +
              "להזזה למעלה או למטה. רווח או אנטר לשחרור, אסקייפ לביטול.",
            onDragStart: ({ position, total }) =>
              `הפריט הורם ממיקום ${position} מתוך ${total}.`,
            onDragOver: ({ position, total }) =>
              `הפריט הוזז למיקום ${position} מתוך ${total}.`,
            onDragEnd: ({ position, total }) =>
              `הפריט שוחרר במיקום ${position} מתוך ${total}.`,
            onDragCancel: ({ position }) =>
              `המיון בוטל. הפריט חזר למיקום ${position}.`,
          }}
          renderItem={(task) => <span style={{ flex: 1 }}>{task.title}</span>}
          aria-label="משימות השקה"
        />
      </div>
    );
  },
};

/** Reordering disabled — rows render normally but nothing lifts. */
export const Disabled: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <SortableList
        items={initialTasks}
        onReorder={() => {}}
        disabled
        renderItem={(task) => <span style={{ flex: 1 }}>{task.title}</span>}
        aria-label="Launch tasks"
      />
    </div>
  ),
};
