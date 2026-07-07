import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";
import { VirtualDataTable } from "./VirtualDataTable";
import type { Column, SortState } from "./DataTable";
import { EmptyState } from "./EmptyState";
/* virtual-table.css ships outside styles/index.css (the /virtual subpath is
   opt-in), so the story imports it directly, like a consumer would. */
import "../styles/virtual-table.css";

interface Person {
  id: number;
  name: string;
  department: string;
  region: string;
  score: number;
  deals: number;
}

const FIRST = ["Ada", "Ben", "Chen", "Dana", "Eyal", "Fern", "Gil", "Hila", "Ivan", "Jo"];
const LAST = ["Levi", "Katz", "Mizrahi", "Peretz", "Cohen", "Baron", "Adler", "Golan", "Sharon", "Weiss"];
const DEPARTMENTS = ["Sales", "Support", "Engineering", "Finance", "Operations"];
const REGIONS = ["EMEA", "APAC", "Americas"];

/* Deterministic pseudo-random rows — the story renders the same 5,000 every time. */
function makePeople(count: number, offset = 0): Person[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + offset;
    return {
      id: n + 1,
      name: `${FIRST[n % FIRST.length]} ${LAST[(n * 7) % LAST.length]}`,
      department: DEPARTMENTS[(n * 3) % DEPARTMENTS.length],
      region: REGIONS[(n * 5) % REGIONS.length],
      score: ((n * 37) % 1000) / 10,
      deals: (n * 13) % 90,
    };
  });
}

const columns: Column<Person>[] = [
  { id: "id", header: "#", accessor: "id", numeric: true, width: 72 },
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "department", header: "Department", accessor: "department", sortable: true, width: 160 },
  { id: "region", header: "Region", accessor: "region", width: 120 },
  { id: "score", header: "Score", accessor: "score", numeric: true, sortable: true, width: 120 },
  { id: "deals", header: "Deals", accessor: "deals", numeric: true, sortable: true, width: 110 },
];

const meta: Meta<typeof VirtualDataTable<Person>> = {
  title: "Components/VirtualDataTable",
  component: VirtualDataTable,
};
export default meta;

/** 5,000 rows — scroll through them; only the visible slice is in the DOM.
    Click Name/Department/Score/Deals headers to sort the whole set. */
export const FiveThousandRows: StoryObj = {
  render: () => (
    <VirtualDataTable
      columns={columns}
      data={makePeople(5000)}
      aria-label="People (5,000 rows, virtualized)"
      height={480}
      increaseViewportBy={200}
      footer={<span style={{ fontSize: 13, color: "var(--ml-text-muted)" }}>5,000 rows</span>}
    />
  ),
};

/** Controlled sorting — starts sorted by Score desc; state is owned outside. */
export const SortedControlled: StoryObj = {
  render: () => {
    const [sort, setSort] = useState<SortState | null>({
      columnId: "score",
      direction: "desc",
    });
    return (
      <VirtualDataTable
        columns={columns}
        data={makePeople(5000)}
        aria-label="People, controlled sort"
        height={480}
        sortState={sort}
        onSortChange={setSort}
      />
    );
  },
};

/** Infinite scroll — onEndReached appends the next page as you hit the bottom. */
export const InfiniteScroll: StoryObj = {
  render: () => {
    const [people, setPeople] = useState(() => makePeople(200));
    const loadMore = useCallback(() => {
      setPeople((prev) =>
        prev.length >= 5000 ? prev : [...prev, ...makePeople(200, prev.length)],
      );
    }, []);
    return (
      <VirtualDataTable
        columns={columns}
        data={people}
        aria-label="People, infinite scroll"
        height={480}
        onEndReached={loadMore}
        footer={
          <span style={{ fontSize: 13, color: "var(--ml-text-muted)" }}>
            {people.length} rows loaded
          </span>
        }
      />
    );
  },
};

export const Compact: StoryObj = {
  render: () => (
    <VirtualDataTable
      columns={columns}
      data={makePeople(5000)}
      aria-label="People, compact"
      height={400}
      compact
    />
  ),
};

export const Empty: StoryObj = {
  render: () => (
    <VirtualDataTable
      columns={columns}
      data={[]}
      aria-label="People, empty"
      height={320}
      emptyState={
        <EmptyState
          title="No people yet"
          description="Rows will appear here once data loads."
          variant="no-data"
        />
      }
    />
  ),
};
