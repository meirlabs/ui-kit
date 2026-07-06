import { Avatar } from "../../src/components/Avatar";

export function AvatarDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Sizes (initials)</div>
        <div className="demo-row" style={{ alignItems: "center" }}>
          <Avatar size="xs" fallback="XS" />
          <Avatar size="sm" fallback="S" />
          <Avatar size="md" fallback="MD" />
          <Avatar size="lg" fallback="LG" />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">With image</div>
        <div className="demo-row" style={{ alignItems: "center" }}>
          <Avatar
            size="md"
            src="https://api.dicebear.com/9.x/initials/svg?seed=MR&backgroundColor=1a7f37&textColor=ffffff"
            alt="Meir R"
          />
          <Avatar
            size="lg"
            src="https://api.dicebear.com/9.x/initials/svg?seed=AB&backgroundColor=656d76&textColor=ffffff"
            alt="Ada B"
          />
          <Avatar size="md" round={false} fallback="SQ" alt="Square" />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Broken image → initials fallback (never a broken glyph)</div>
        <div className="demo-row" style={{ alignItems: "center" }}>
          <Avatar size="md" src="/does-not-exist.png" fallback="MR" alt="Meir R" />
          <Avatar size="lg" src="/nope.png" alt="Grace Hopper" />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Presence status</div>
        <div className="demo-row" style={{ alignItems: "center" }}>
          <Avatar size="md" fallback="ON" status="online" alt="Online" />
          <Avatar size="md" fallback="AW" status="away" alt="Away" />
          <Avatar size="md" fallback="BZ" status="busy" alt="Busy" />
          <Avatar size="md" fallback="OF" status="offline" alt="Offline" />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Interactive (focusable menu trigger)</div>
        <div className="demo-row" style={{ alignItems: "center" }}>
          <Avatar
            size="lg"
            fallback="MR"
            interactive
            status="online"
            aria-label="Account menu"
          />
        </div>
      </div>
    </>
  );
}
