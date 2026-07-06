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

export const ManyPagesWindowed: StoryObj = {
  render: () => {
    const [page, setPage] = useState(24);
    return <Pagination pageIndex={page} pageCount={50} onPage={setPage} />;
  },
};

export const WithEdges: StoryObj = {
  render: () => {
    const [page, setPage] = useState(4);
    return (
      <Pagination pageIndex={page} pageCount={20} onPage={setPage} showEdges />
    );
  },
};

export const WiderWindow: StoryObj = {
  render: () => {
    const [page, setPage] = useState(24);
    return (
      <Pagination
        pageIndex={page}
        pageCount={50}
        onPage={setPage}
        siblingCount={2}
      />
    );
  },
};

export const WithPageSize: StoryObj = {
  render: () => {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);
    return (
      <Pagination
        pageIndex={page}
        pageCount={12}
        onPage={setPage}
        showEdges
        pageSize={size}
        pageSizeOptions={[10, 25, 50, 100]}
        onPageSizeChange={(s) => {
          setSize(s);
          setPage(0);
        }}
      />
    );
  },
};
