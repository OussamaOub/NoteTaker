import React, { useState } from "react";
import Modal from "react-modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

Modal.setAppElement("#root"); 

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
    handleAddNote(newNote); 
    handleNoteAdded(newNote);

    
    setTitle("");
    setContent("");

    
    closeModal();
  };

  return (
    <div>
 

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
