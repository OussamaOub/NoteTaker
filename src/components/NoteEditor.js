import { useState, useEffect } from "react";
import Modal from "react-modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
Modal.setAppElement("#root"); // Set the app root element for accessibility

export default function NoteEditor({
  note,
  handleNoteEdited,
  isOpn,
  onClose, // Add onClose prop to handle closing the modal
}) {
  const [updatedNote, setUpdatedNote] = useState(note);

  useEffect(() => {
    setUpdatedNote(note);
  }, [note]);

  const handleNoteUpdate = async () => {
    if (updatedNote.title.trim() === "") {
      alert("Title cannot be empty");
      return;
    }
    handleNoteEdited(updatedNote);
    onClose(); // Close the modal
  };

  return (
    <div>
      <Modal
        isOpen={isOpn}
        className="modal"
        overlayClassName="modal-overlay"
        onRequestClose={onClose} // Add onRequestClose prop to handle closing the modal
      >
        <div className="modal-content">
          <h2>Edit Note</h2>
          <input
            type="text"
            value={updatedNote.title}
            onChange={(e) => {
              setUpdatedNote((prevNote) => ({
                ...prevNote,
                title: e.target.value,
              }));
            }}
            placeholder="Title"
          />

          <ReactQuill
            value={updatedNote.content}
            onChange={(content) => {
              setUpdatedNote((prevNote) => ({
                ...prevNote,
                content: content,
              }));
            }}
            style={{
              flexWrap: "wrap",
              height: `${window.innerHeight - 0.5 * window.innerHeight}px`,
              marginBottom: "20px",
              width: `${window.innerWidth - 0.3 * window.innerWidth}px`,
              transition: "all 0.3s ease",
            }}
          />

          <div className="button-group">
            <button className="save-buttton" onClick={handleNoteUpdate}>
              Save
            </button>
            <button className="cancel-buttton" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
