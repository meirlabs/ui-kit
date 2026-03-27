import { Button } from "../../src/components/Button";

export function ButtonDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Variants</div>
        <div className="demo-row">
          <Button variant="primary">Primary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </div>
      <div className="demo-section">
        <div className="demo-label">Disabled</div>
        <div className="demo-row">
          <Button variant="primary" disabled>Primary</Button>
          <Button variant="ghost" disabled>Ghost</Button>
          <Button variant="danger" disabled>Danger</Button>
        </div>
      </div>
    </>
  );
}
