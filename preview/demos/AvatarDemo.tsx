import { Avatar } from "../../src/components/Avatar";

export function AvatarDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Sizes (with initials)</div>
        <div className="demo-row">
          <Avatar size="sm" fallback="S" />
          <Avatar size="md" fallback="MD" />
          <Avatar size="lg" fallback="LG" />
        </div>
      </div>
      <div className="demo-section">
        <div className="demo-label">Round</div>
        <div className="demo-row">
          <Avatar size="sm" fallback="S" round />
          <Avatar size="md" fallback="MD" round />
          <Avatar size="lg" fallback="LG" round />
        </div>
      </div>
      <div className="demo-section">
        <div className="demo-label">With image</div>
        <div className="demo-row">
          <Avatar
            size="md"
            src="https://api.dicebear.com/9.x/initials/svg?seed=MR&backgroundColor=3fb950&textColor=ffffff"
            alt="MR"
          />
          <Avatar
            size="lg"
            src="https://api.dicebear.com/9.x/initials/svg?seed=AB&backgroundColor=58a6ff&textColor=ffffff"
            alt="AB"
            round
          />
        </div>
      </div>
    </>
  );
}
