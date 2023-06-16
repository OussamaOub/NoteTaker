import React, { useState } from "react";
import Modal from "react-modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useUser } from "./UserProvider";

Modal.setAppElement("#root"); // Set the app root element for accessibility

export default function PopupWindow({
  handleAddNote,
  handleNoteAdded,
  notecount,
  isOpn,
}) {
  let storedUser = localStorage.getItem("user");
  let user = storedUser ? JSON.parse(storedUser) : null;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(isOpn);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleSubmit = () => {
    // Handle submission of title and content
    // You can perform any necessary actions here, such as saving the data or triggering an API request
    if (title.trim() === "") {
      alert("Title cannot be empty");
      return;
    }

    const newNote = {
      title: title.trim(),
      content: content,
      noteId: notecount + 1,
      uid: user.uid,
      createdAt: new Date().toLocaleString(),
    };
    handleAddNote(newNote); // Assuming `handleAddNote` is a function passed as a prop
    handleNoteAdded(newNote);

    // Reset the form
    setTitle("");
    setContent("");

    // Close the modal
    closeModal();
  };

  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        onClick={openModal}
        onMouseOver={(e) => {
          e.target.style.cursor = "pointer";
        }}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
      >
        {/* Plus icon SVG code */}
        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
      </svg>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2
            style={{
              textAlign: "center",
              marginTop: 0,
            }}
          >
            Add Note
          </h2>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Title"
          />

          <ReactQuill
            value={content}
            onChange={handleContentChange}
            style={{
              // display: "flex",
              flexWrap: "wrap",
              height: `${window.innerHeight - 0.5 * window.innerHeight}px`,
              marginBottom: "20px",
              width: `${window.innerWidth - 0.3 * window.innerWidth}px`,
              transition: "all 0.3s ease",
            }}
          />

          <div className="button-group">
            <button className="save-buttton" onClick={handleSubmit}>
              Save
            </button>
            <button className="cancel-buttton" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
