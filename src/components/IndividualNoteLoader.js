import { Modal } from "@mui/material";
import React from "react";

export default function IndividualNoteLoader({ note }) {
  return (
    <div>
      <Modal open={true}>
        <div className="note-card">
          <h1>{note.title}</h1>
          <p>{note.content}</p>
        </div>
      </Modal>
    </div>
  );
}
