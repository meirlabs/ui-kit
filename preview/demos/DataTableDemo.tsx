import { useMemo, useState } from "react";
import { DataTable, type Column } from "../../src/components/DataTable";
import { Pagination } from "../../src/components/Pagination";
import { StatusPill } from "../../src/components/StatusPill";
import { Tag } from "../../src/components/Tag";
import { ChipRow } from "../../src/components/ChipRow";
import { MetricValue } from "../../src/components/MetricValue";
import { EmptyState } from "../../src/components/EmptyState";

interface User {
  id: number;
  name: string;
  role: string;
  departments: string[];
  status: "good" | "warn" | "neutral";
  statusLabel: string;
  revenue: number;
}

const users: User[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: ["Alice Chen", "Bob Martinez", "Carol Johnson", "David Kim", "Eva Kowalski"][i % 5],
  role: ["Engineer", "Designer", "Manager", "Analyst", "Director"][i % 5],
  departments: [
    ["Engineering"],
    ["Design", "UX"],
    ["Operations"],
    ["Data", "Analytics"],
    ["Leadership", "Strategy"],
  ][i % 5],
  status: (["good", "warn", "neutral"] as const)[i % 3],
  statusLabel: ["Active", "On Leave", "Onboarding"][i % 3],
  revenue: [12500, -3200, 8900, 0, 45600][i % 5],
}));

const money = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    signDisplay: "exceptZero",
  }).format(v);

const columns: Column<User>[] = [
  {
    id: "name",
    header: "Name",
    sortable: true,
    accessor: (u) => (
      <div>
        <div style={{ fontWeight: 500 }}>{u.name}</div>
        <div style={{ marginTop: 2, fontSize: 12, color: "var(--ml-text-muted)" }}>
          ID #{u.id}
        </div>
      </div>
    ),
    sortFn: (a, b) => a.name.localeCompare(b.name),
  },
  { id: "role", header: "Role", accessor: "role", sortable: true },
  {
    id: "departments",
    header: "Departments",
    accessor: (u) => (
      <ChipRow>
        {u.departments.map((d) => (
          <Tag key={d}>{d}</Tag>
        ))}
      </ChipRow>
    ),
  },
  {
    id: "status",
    header: "Status",
    accessor: (u) => <StatusPill tone={u.status}>{u.statusLabel}</StatusPill>,
  },
  {
    id: "revenue",
    header: "Revenue",
    numeric: true,
    sortable: true,
    accessor: (u) => <MetricValue value={u.revenue} formatter={money} />,
    sortFn: (a, b) => a.revenue - b.revenue,
  },
];

const PAGE_SIZE = 8;

export function DataTableDemo() {
  const [page, setPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const pageCount = Math.ceil(users.length / PAGE_SIZE);
  const pageRows = useMemo(
    () => users.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [page],
  );

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">
          Sortable + selectable + sticky header (paired with Pagination)
        </div>
        <DataTable<User>
          columns={columns}
          data={pageRows}
          getRowId={(u) => String(u.id)}
          aria-label="Team members"
          caption="Team members with role, departments, status and revenue"
          selectable="multiple"
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          stickyHeader
          defaultSort={{ columnId: "revenue", direction: "desc" }}
          onRowClick={(u) => console.log("row", u.id)}
          footer={
            <>
              <span style={{ marginRight: "auto", fontSize: 13, color: "var(--ml-text-muted)" }}>
                {selectedIds.length} selected
              </span>
              <Pagination pageIndex={page} pageCount={pageCount} onPage={setPage} />
            </>
          }
        />
      </div>

      <div className="demo-section">
        <div className="demo-label">Compact density</div>
        <DataTable<User>
          columns={columns.slice(0, 4)}
          data={users.slice(0, 4)}
          getRowId={(u) => String(u.id)}
          aria-label="Compact team"
          compact
        />
      </div>

      <div className="demo-section">
        <div className="demo-label">Loading (skeleton rows reserve height)</div>
        <DataTable<User>
          columns={columns}
          data={[]}
          aria-label="Loading team"
          loading
          loadingRowCount={4}
        />
      </div>

      <div className="demo-section">
        <div className="demo-label">Empty (composed with EmptyState)</div>
        <DataTable<User>
          columns={columns}
          data={[]}
          aria-label="Empty team"
          emptyState={
            <EmptyState
              variant="no-results"
              title="No matching people"
              description="Try adjusting your filters or search terms."
            />
          }
        />
      </div>

      <div className="demo-section">
        <div className="demo-label">Error state</div>
        <DataTable<User>
          columns={columns}
          data={[]}
          aria-label="Errored team"
          error="Couldn't load team members. Retry."
        />
      </div>
    </>
  );
}
