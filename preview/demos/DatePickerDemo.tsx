import { useState } from "react";
import { DatePicker } from "../../src/components/DatePicker";

export function DatePickerDemo() {
  const [appointment, setAppointment] = useState<Date | null>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(new Date());

  const today = new Date();

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Uncontrolled (arrows/Home/End/PageUp/PageDown, Escape)</div>
        <DatePicker aria-label="Appointment date" onValueChange={setAppointment} />
        <p style={{ fontSize: 14, color: "var(--ml-text-muted)", marginTop: 12 }}>
          Selected: <strong>{appointment ? appointment.toDateString() : "none"}</strong>
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-label">Controlled, with a min date (no past days)</div>
        <DatePicker
          aria-label="Check-in date"
          value={checkIn}
          onValueChange={setCheckIn}
          minDate={today}
          name="check-in"
        />
      </div>

      <div className="demo-section">
        <div className="demo-label">Disabled</div>
        <DatePicker aria-label="Blocked date" disabled placeholder="Not available" />
      </div>
    </>
  );
}
