import {
  type CSSProperties,
  type HTMLAttributes,
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
  useCallback,
  useId,
  useMemo,
} from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type ScreenReaderInstructions,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../utils/cn";

/* ─── Types ─── */

export interface SortableListItem {
  /** Stable unique id — never an array index. */
  id: UniqueIdentifier;
}

/**
 * Localizable screen-reader strings. Defaults are English; pass Hebrew (or any
 * other language) on localized surfaces. Positions are 1-based.
 */
export interface SortableListAnnouncements {
  /** `aria-roledescription` applied to each drag activator. */
  roleDescription: string;
  /** Instructions read when a drag activator receives focus. */
  instructions: string;
  onDragStart: (args: { position: number; total: number }) => string;
  onDragOver: (args: { position: number; total: number }) => string;
  onDragEnd: (args: { position: number; total: number }) => string;
  onDragCancel: (args: { position: number; total: number }) => string;
}

export const defaultSortableAnnouncements: SortableListAnnouncements = {
  roleDescription: "sortable",
  instructions:
    "To pick up a sortable item, press space or enter. " +
    "While dragging, use the arrow keys to move the item up or down. " +
    "Press space or enter again to drop, or escape to cancel.",
  onDragStart: ({ position, total }) =>
    `Picked up item in position ${position} of ${total}.`,
  onDragOver: ({ position, total }) =>
    `Item moved to position ${position} of ${total}.`,
  onDragEnd: ({ position, total }) =>
    `Item dropped in position ${position} of ${total}.`,
  onDragCancel: ({ position }) =>
    `Reordering cancelled. Item returned to position ${position}.`,
};

/**
 * Props to spread onto the drag activator element in handle mode
 * (`<SortableHandle {...dragHandleProps} />` or your own focusable element).
 * In whole-row mode the row itself is the activator and this is inert.
 */
export type SortableDragHandleProps = HTMLAttributes<HTMLElement> & {
  ref: (element: HTMLElement | null) => void;
};

export interface SortableItemRenderState {
  /** Spread onto your handle element when `handle` is set; inert otherwise. */
  dragHandleProps: SortableDragHandleProps;
  /** True while this row is being dragged. */
  isDragging: boolean;
  /** Current index of the item in `items`. */
  index: number;
}

export interface SortableListProps<T extends SortableListItem>
  extends Omit<ComponentPropsWithoutRef<"ul">, "children" | "onDragEnd"> {
  /** Items in render order. Each needs a stable `id`. */
  items: T[];
  /**
   * Called after a completed drag with the reordered array plus the
   * from/to indices. The list is controlled — store `newItems` in state.
   */
  onReorder: (
    newItems: T[],
    detail: { fromIndex: number; toIndex: number },
  ) => void;
  /** Renders a row's content. */
  renderItem: (item: T, state: SortableItemRenderState) => ReactNode;
  /**
   * Explicit-handle mode: only the element receiving `dragHandleProps`
   * starts a drag. Default (false) makes the whole row draggable.
   */
  handle?: boolean;
  /** Disables reordering entirely. */
  disabled?: boolean;
  /** Override screen-reader strings (e.g. Hebrew on HE surfaces). */
  announcements?: Partial<SortableListAnnouncements>;
}

/* ─── Row ─── */

/** Matches --ml-duration-slow / --ml-ease-out (inline because dnd-kit owns the transition). */
const SORT_TRANSITION = {
  duration: 200,
  easing: "cubic-bezier(0.23, 1, 0.32, 1)",
};

const inertHandleProps: SortableDragHandleProps = { ref: () => {} };

interface SortableRowProps<T extends SortableListItem> {
  item: T;
  index: number;
  handle: boolean;
  disabled: boolean;
  roleDescription: string;
  renderItem: SortableListProps<T>["renderItem"];
}

function SortableRow<T extends SortableListItem>({
  item,
  index,
  handle,
  disabled,
  roleDescription,
  renderItem,
}: SortableRowProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled,
    transition: SORT_TRANSITION,
    attributes: { roleDescription },
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const activatorProps = { ...attributes, ...listeners };
  const dragHandleProps: SortableDragHandleProps =
    handle && !disabled
      ? ({ ...activatorProps, ref: setActivatorNodeRef } as SortableDragHandleProps)
      : inertHandleProps;

  return (
    <li
      ref={setNodeRef}
      className="ml-sortable-item"
      style={style}
      data-dragging={isDragging || undefined}
      data-draggable={!handle && !disabled ? "" : undefined}
      {...(!handle ? activatorProps : {})}
    >
      {renderItem(item, { dragHandleProps, isDragging, index })}
    </li>
  );
}

/* ─── Handle ─── */

export interface SortableHandleProps
  extends ComponentPropsWithoutRef<"button"> {}

function GripIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="5.5" cy="3.5" r="1.15" fill="currentColor" />
      <circle cx="10.5" cy="3.5" r="1.15" fill="currentColor" />
      <circle cx="5.5" cy="8" r="1.15" fill="currentColor" />
      <circle cx="10.5" cy="8" r="1.15" fill="currentColor" />
      <circle cx="5.5" cy="12.5" r="1.15" fill="currentColor" />
      <circle cx="10.5" cy="12.5" r="1.15" fill="currentColor" />
    </svg>
  );
}

/**
 * `SortableHandle` — a ready-made grip button for handle mode. Spread the
 * row's `dragHandleProps` onto it:
 *
 * ```tsx
 * <SortableHandle {...dragHandleProps} aria-label="Reorder task" />
 * ```
 */
export const SortableHandle = forwardRef<HTMLButtonElement, SortableHandleProps>(
  function SortableHandle({ className, children, ...rest }, ref) {
    return (
      <button
        type="button"
        aria-label="Drag to reorder"
        ref={ref}
        className={cn("ml-sortable-handle", className)}
        {...rest}
      >
        {children ?? <GripIcon />}
      </button>
    );
  },
);

/* ─── List ─── */

/**
 * `SortableList` — a thin, generic vertical drag-to-reorder list on dnd-kit.
 * Ships only from `@meir-labs/ui-kit/sortable` (dnd-kit is an optional peer).
 *
 * - Pointer drags activate after 5px of movement, so plain clicks on row
 *   content never misfire as drags.
 * - Keyboard: focus a row (or its handle), Space/Enter lifts, ArrowUp/Down
 *   moves, Space/Enter drops, Escape cancels.
 * - Screen-reader announcements are overridable via `announcements` for
 *   localized surfaces.
 *
 * ```tsx
 * <SortableList
 *   items={tasks}
 *   onReorder={setTasks}
 *   renderItem={(task) => task.title}
 * />
 * ```
 */
export function SortableList<T extends SortableListItem>({
  items,
  onReorder,
  renderItem,
  handle = false,
  disabled = false,
  announcements,
  className,
  ...rest
}: SortableListProps<T>) {
  const contextId = useId();
  const strings = useMemo<SortableListAnnouncements>(
    () => ({ ...defaultSortableAnnouncements, ...announcements }),
    [announcements],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const ids = useMemo(() => items.map((item) => item.id), [items]);
  const getPosition = useCallback(
    (id: UniqueIdentifier) => ids.indexOf(id) + 1,
    [ids],
  );

  const accessibility = useMemo(() => {
    const total = ids.length;
    const dndAnnouncements: Announcements = {
      onDragStart: ({ active }) =>
        strings.onDragStart({ position: getPosition(active.id), total }),
      // over === active fires on lift; announcing it would instantly
      // overwrite the onDragStart announcement in the live region.
      onDragOver: ({ active, over }) =>
        over && over.id !== active.id
          ? strings.onDragOver({ position: getPosition(over.id), total })
          : undefined,
      onDragEnd: ({ active, over }) =>
        strings.onDragEnd({
          position: getPosition(over?.id ?? active.id),
          total,
        }),
      onDragCancel: ({ active }) =>
        strings.onDragCancel({ position: getPosition(active.id), total }),
    };
    const screenReaderInstructions: ScreenReaderInstructions = {
      draggable: strings.instructions,
    };
    return { announcements: dndAnnouncements, screenReaderInstructions };
  }, [strings, ids.length, getPosition]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over == null || active.id === over.id) return;
    const fromIndex = ids.indexOf(active.id);
    const toIndex = ids.indexOf(over.id);
    if (fromIndex < 0 || toIndex < 0) return;
    onReorder(arrayMove(items, fromIndex, toIndex), { fromIndex, toIndex });
  }

  return (
    <DndContext
      id={contextId}
      sensors={sensors}
      collisionDetection={closestCenter}
      accessibility={accessibility}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ul className={cn("ml-sortable", className)} {...rest}>
          {items.map((item, index) => (
            <SortableRow
              key={item.id}
              item={item}
              index={index}
              handle={handle}
              disabled={disabled}
              roleDescription={strings.roleDescription}
              renderItem={renderItem}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
