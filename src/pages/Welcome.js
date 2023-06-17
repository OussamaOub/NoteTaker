import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addnote,
  addtodo,
  deletenote,
  deletetodo,
  editnote,
  getnotes,
  getnotesandtodocount,
  getTodos,
  toggletodo,
  updatenotescount,
  updatetodocount,
} from "../firebasestuff";
import { ReactComponent as Plus } from "../Gallery/plus.svg";
import Header from "../components/Header";
import FirstNote from "../components/FirstNote";
import NotesLoader from "../components/NotesLoader";
import TodosLoader from "../components/TodosLoader";
import Swal from "sweetalert2";
import Schedule from "../components/Schedule";
import PopupWindow from "../components/PopupWindow";
import NoteEditor from "../components/NoteEditor";

export default function Welcome() {
  let storedUser = localStorage.getItem("user");
  let user = storedUser ? JSON.parse(storedUser) : null;
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [todos, setTodos] = useState([]);
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  const [noteCount, setNoteCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [todocount, setTodoCount] = useState(0);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      const tokenExpiration = localStorage.getItem("tokenExpiration");

      if (token && tokenExpiration) {
        const currentTime = new Date().getTime();
        if (currentTime > Number(tokenExpiration)) {
          
          navigate("/", { replace: true });
        }
      } else {
        
        navigate("/", { replace: true });
      }
    };

    const fetchNotes = async () => {
      const data = await getnotes(user.uid);
      setNotes(data);
      const count = await getnotesandtodocount(user.uid);
      setNoteCount(count.notescount);
      setIsLoadingNotes(false);
    };

    const fetchTodos = async () => {
      const data = await getTodos(user.uid);
      const count = await getnotesandtodocount(user.uid);
      setTodos(data);
      setTodoCount(count.todocount);
      setIsLoadingTodos(false);
    };

    const fetchData = async () => {
      if (user) {
        checkTokenExpiration(); 
        await Promise.all([fetchNotes(), fetchTodos()]);
      } else {
        navigate("/", { replace: true });
      }
    };

    fetchData();
  }, [storedUser, navigate]);

  const handleAddNote = async (newNote) => {
    setIsLoadingNotes(true);
    await addnote(user.uid, newNote);
    const updatedNotes = await getnotes(user.uid);
    setNotes(updatedNotes);
    await updatenotescount(user.uid, noteCount + 1);
    const count = await getnotesandtodocount(user.uid);
    setNoteCount(count.notescount);
    setIsLoadingNotes(false);
    setIsPopupOpen(false);
  };

  const handleAddTodo = async (newTodo) => {
    await addtodo(user.uid, newTodo);
    const updatedTodos = await getTodos(user.uid);
    await updatetodocount(user.uid, todocount + 1);
    const count = await getnotesandtodocount(user.uid);
    setTodoCount(count.todocount);
    setTodos(updatedTodos);
  };

  const handleToggleTodo = async (todo) => {
    await toggletodo(user.uid, todo.todoId);
    const updatedTodos = await getTodos(user.uid);
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = async (todo) => {
    setIsLoadingTodos(true);
    await deletetodo(user.uid, todo.todoId);
    const updatedTodos = await getTodos(user.uid);
    setTodos(updatedTodos);
    setIsLoadingTodos(false);
  };

  const handleNoteAdded = (newNote) => {
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const handleNoteClick = (note) => {
    setIsNoteEditorOpen(false);
    setSelectedNote(note);
    setIsNoteEditorOpen(true);
  };

  const handleNoteEdited = async (editedNote) => {
    await editnote(user.uid, editedNote.noteId, editedNote);
    const updatedNotes = await getnotes(user.uid);
    setNotes(updatedNotes);
  };

  const handleDeleteNote = async (note) => {
    setIsLoadingNotes(true);
    await deletenote(user.uid, note.noteId);
    const updatedNotes = await getnotes(user.uid);
    setNotes(updatedNotes);
    setIsLoadingNotes(false);
  };

  if (!user) {
    return null;
  }

  if (isLoadingNotes || isLoadingTodos) {
    return (
      <div className="lds-ripple-2">
        <div></div>
        <div></div>
      </div>
    ); 
  }
  

  return (
    <>
      <Header />
      {(notes && noteCount === 0) || notes === undefined ? (
        <FirstNote onAddNote={handleAddNote} />
      ) : (
        <div className="wrapper">
                    <div className="notes-area">
            <NotesLoader
              notes={notes}
              mode="short"
              onNoteClick={handleNoteClick}
              handleDeleteNote={handleDeleteNote}
            />
          </div>

          <div className="todocontainer">
            <div className="todoheader">
              <h2>ToDo</h2>
              <Plus
                onClick={() => {
                  Swal.fire({
                    title: "Enter your task",
                    input: "text",
                    inputAttributes: {
                      autocapitalize: "off",
                    },
                    showCancelButton: true,
                    confirmButtonText: "Add",
                    showLoaderOnConfirm: true,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      if (result.value !== "") {
                        const newTodo = {
                          content: result.value,
                          isDone: false,
                          todoId: todocount + 1,
                        };
                        handleAddTodo(
                          newTodo,
                          Swal.fire("Added!", "", "success")
                        );
                      } else {
                        Swal.fire({
                          icon: "error",
                          title: "Oops...",
                          text: "You must enter something!",
                        });
                      }
                    }
                  });
                }}
                onMouseOver={(e) => {
                  e.target.style.cursor = "pointer";
                }}
              />
            </div>
            <div className="todos-content">
              <TodosLoader
                todos={todos}
                handleAddTodo={handleAddTodo}
                handleToggleTodo={handleToggleTodo}
                handleDeleteTodo={handleDeleteTodo}
              />
            </div>
          </div>
          <div className="calendarcontainer">
            <Schedule />
          </div>
          <Plus
            onClick={() => {
              setIsPopupOpen(true);
            }}
            onMouseOver={(e) => {
              e.target.style.cursor = "pointer";
            }}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
            }}
          />
          {isPopupOpen ? (
            <PopupWindow
              notes={notes}
              handleAddNote={handleAddNote}
              handleNoteAdded={handleNoteAdded}
              notecount={noteCount}
              isOpn={isPopupOpen}
            />
          ) : null}
          {isNoteEditorOpen ? (
            <NoteEditor
              note={selectedNote}
              handleNoteEdited={handleNoteEdited}
              isOpn={isNoteEditorOpen}
              onClose={() => setIsNoteEditorOpen(false)} 
            />
          ) : null}
        </div>
      )}
    </>
  );
}
