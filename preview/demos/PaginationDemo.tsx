import { useState } from "react";
import { Pagination } from "../../src/components/Pagination";

export function PaginationDemo() {
  const [page5, setPage5] = useState(0);
  const [page12, setPage12] = useState(0);

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">5 pages</div>
        <Pagination pageIndex={page5} pageCount={5} onPage={setPage5} />
      </div>
      <div className="demo-section">
        <div className="demo-label">12 pages</div>
        <Pagination pageIndex={page12} pageCount={12} onPage={setPage12} />
      </div>
      <div className="demo-section">
        <div className="demo-label">1 page (hidden)</div>
        <div style={{ color: "var(--ml-text-faint)", fontSize: "0.78rem" }}>
          Pagination returns null when pageCount &le; 1
        </div>
        <Pagination pageIndex={0} pageCount={1} onPage={() => {}} />
      </div>
    </>
  );
}
