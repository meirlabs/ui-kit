// Subpath entry: @meir-labs/ui-kit/virtual
// Requires the optional peer dependency react-virtuoso.
export { VirtualDataTable } from "./components/VirtualDataTable";
export type { VirtualDataTableProps } from "./components/VirtualDataTable";
// Re-export the shared table types so /virtual consumers don't need a second
// import from the main entry to type their columns.
export type {
  Column,
  ColumnAlign,
  SortDirection,
  SortState,
} from "./components/DataTable";
