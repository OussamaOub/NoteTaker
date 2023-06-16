import React, { useState } from "react";
import Calendar from "react-calendar";

export default function Schedule() {
  const [value, onChange] = useState(new Date());
  return (
    <div>
      <Calendar
        onChange={onChange}
        value={value}
        className="calendar"
        calendarType="ISO 8601"
        // mark current date
      />
    </div>
  );
}
