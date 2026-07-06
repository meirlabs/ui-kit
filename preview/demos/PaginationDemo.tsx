import { useState } from "react";
import { Pagination } from "../../src/components/Pagination";

export function PaginationDemo() {
  const [page5, setPage5] = useState(0);
  const [page50, setPage50] = useState(24);
  const [pageEdge, setPageEdge] = useState(4);
  const [pageSized, setPageSized] = useState(0);
  const [size, setSize] = useState(25);

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">5 pages</div>
        <Pagination pageIndex={page5} pageCount={5} onPage={setPage5} />
      </div>

      <div className="demo-section">
        <div className="demo-label">50 pages — windowed with … gaps</div>
        <Pagination pageIndex={page50} pageCount={50} onPage={setPage50} />
      </div>

      <div className="demo-section">
        <div className="demo-label">First/last edge buttons (showEdges)</div>
        <Pagination
          pageIndex={pageEdge}
          pageCount={20}
          onPage={setPageEdge}
          showEdges
        />
      </div>

      <div className="demo-section">
        <div className="demo-label">With rows-per-page control</div>
        <Pagination
          pageIndex={pageSized}
          pageCount={12}
          onPage={setPageSized}
          showEdges
          pageSize={size}
          pageSizeOptions={[10, 25, 50, 100]}
          onPageSizeChange={(s) => {
            setSize(s);
            setPageSized(0);
          }}
        />
      </div>

      <div className="demo-section">
        <div className="demo-label">1 page (hidden)</div>
        <div style={{ color: "var(--ml-text-faint)", fontSize: "0.78rem" }}>
          Pagination returns null when pageCount &le; 1 (and there is no size control)
        </div>
        <Pagination pageIndex={0} pageCount={1} onPage={() => {}} />
      </div>
    </>
  );
}
