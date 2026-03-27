import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
};
export default meta;

export const Default: StoryObj = {
  render: () => {
    const [page, setPage] = useState(0);
    return <Pagination pageIndex={page} pageCount={5} onPage={setPage} />;
  },
};

export const SinglePage: StoryObj = {
  render: () => <Pagination pageIndex={0} pageCount={1} onPage={() => {}} />,
};

export const ManyPages: StoryObj = {
  render: () => {
    const [page, setPage] = useState(0);
    return <Pagination pageIndex={page} pageCount={12} onPage={setPage} />;
  },
};
