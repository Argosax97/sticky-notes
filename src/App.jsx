import "./App.scss";
import React, { useState, useReducer, useEffect } from "react";

  const savedItems = JSON.parse(localStorage.getItem("notes"));
console.log(savedItems);
const ACTIONS = {
  AddNote: "addnewnote",
  RemoveNote: "removenote",
};

const initialState = {
  lastNoteCreated: savedItems.lastNoteCreated,
  totalNotes: savedItems.totalNotes,
  notes: savedItems.notes,
};

function reducer(previousState, action) {
  switch (action.type) {
    case ACTIONS.AddNote: {
      const newState = {
        lastNoteCreated: new Date().toTimeString().slice(0, 8),
        totalNotes: previousState.notes.length + 1,
        notes: [...previousState.notes, action.payload],
      };
      return newState;
    }
    case ACTIONS.RemoveNote:
      const newState = {
        ...previousState,
        notes: previousState.notes.filter(
          (note) => note.id !== action.payload.id
        ),
        totalNotes: previousState.notes.length - 1,
      };
      return newState;
    default:
      throw new Error();
  }
}
const App = () => {
  const [noteValue, setNoteValue] = useState("");
  const [notesState, dispatch] = useReducer(reducer, initialState);
  console.log(notesState);
  const createNote = (e) => {
    e.preventDefault();
    if (!noteValue) return;
    const newNote = {
      id: Math.floor(Math.random() * 1000),
      inputText: noteValue,
    };
    dispatch({ type: ACTIONS.AddNote, payload: newNote });
    setNoteValue("");
    console.log(notesState);
  };

  const dropNote = (e) => {
    e.target.style.top = `${e.pageY - 50}px`;
    e.target.style.left = `${e.pageX - 50}px`;
  };
  const dragOver = (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notesState));
  }, [notesState]);
  return (
    <div className="create-note" onDragOver={dragOver}>
      <form onSubmit={createNote}>
        <h2>Create new note</h2>
        <p>Last note created: {notesState.lastNoteCreated}</p>
        <textarea
          value={noteValue}
          onChange={(e) => setNoteValue(e.target.value)}
          placeholder="Create new note..."
        />
        <button>Create</button>
      </form>

      {notesState.notes.map((note) => {
        return (
          <div
            key={note.id}
            className="note"
            draggable="true"
            onDragEnd={dropNote}
          >
            <div
              className="close"
              onClick={() =>
                dispatch({ type: ACTIONS.RemoveNote, payload: note })
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <pre> {note.inputText}</pre>
          </div>
        );
      })}
    </div>
  );
};

export default App;
