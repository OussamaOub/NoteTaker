import React from "react";

export default function NotesLoader({
  notes,
  mode,
  onNoteClick,
  handleDeleteNote,
}) {
  if (mode === "short") {
    notes = notes.slice(0, 6);
  }
  return (
    <div className="notes-container">
      {notes.map((note) => (
        <div
          className="note-card"
        >
          <div onClick={() => onNoteClick(note)}>
            <h1>{note.title}</h1>

            <p>{note.content.replace(/(<([^>]+)>)/gi, "")}</p>
          </div>
          <button
            className="delete-button"
            onClick={() => handleDeleteNote && handleDeleteNote(note)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ))}
    </div>
  );
}
