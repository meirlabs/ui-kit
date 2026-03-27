import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "../components/Pagination";
import { usePagination } from "../hooks/usePagination";
import { StatusPill } from "../components/StatusPill";
import { Tag } from "../components/Tag";
import { ChipRow } from "../components/ChipRow";
import { MetricValue } from "../components/MetricValue";

const meta: Meta = {
  title: "Patterns/DataTable",
};
export default meta;

interface User {
  id: number;
  name: string;
  role: string;
  departments: string[];
  status: "good" | "warn" | "neutral";
  statusLabel: string;
  revenue: number;
}

const users: User[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: ["Alice Chen", "Bob Martinez", "Carol Johnson", "David Kim", "Eva Kowalski"][i % 5],
  role: ["Engineer", "Designer", "Manager", "Analyst", "Director"][i % 5],
  departments: [["Engineering"], ["Design", "UX"], ["Operations"], ["Data", "Analytics"], ["Leadership", "Strategy"]][i % 5],
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

export const FullTable: StoryObj = {
  render: () => {
    const { page, pageIndex, pageCount, setPage } = usePagination(users);

    return (
      <div className="ml-dt-wrap">
        <table className="ml-dt">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Departments</th>
              <th>Status</th>
              <th className="ml-dt-r">Revenue</th>
              <th className="ml-dt-chevron-col"></th>
            </tr>
          </thead>
          <tbody>
            {page.map((user) => (
              <tr key={user.id} className="ml-dt-row-link">
                <td>
                  <div className="ml-dt-primary">{user.name}</div>
                  <div className="ml-dt-secondary">ID #{user.id}</div>
                </td>
                <td>{user.role}</td>
                <td>
                  <ChipRow>
                    {user.departments.map((d) => (
                      <Tag key={d}>{d}</Tag>
                    ))}
                  </ChipRow>
                </td>
                <td>
                  <StatusPill tone={user.status}>{user.statusLabel}</StatusPill>
                </td>
                <td className="ml-dt-r">
                  <MetricValue value={user.revenue} formatter={money} />
                </td>
                <td className="ml-dt-chevron">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination pageIndex={pageIndex} pageCount={pageCount} onPage={setPage} />
      </div>
    );
  },
};
