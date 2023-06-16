import { initializeApp } from "firebase/app";
import "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const firebaseConfig = {
  apiKey: process.env.React_App_API_KEY,
  authDomain: process.env.React_App_AUTH_DOMAIN,
  projectId: process.env.React_App_PROJECT_ID,
  storageBucket: process.env.React_App_STORE_BUCKET,
  messagingSenderId: process.env.React_App_MESSAGING_SENDER_ID,
  appId: process.env.React_App_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();

export async function loginwithemailandpassword(email, password) {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    return errorMessage;
  }
}

export async function signupwithemail(email, password, username) {
  try {
    const auth = getAuth();

    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await auth.currentUser
      .updateProfile({
        displayName: username,
      })
      .then(() => {
        console.log("updated");
      })
      .catch((error) => {
        console.log(error);
      });

    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    return errorMessage;
  }
}

export async function logout() {
  const auth = getAuth();
  signOut(auth).catch((error) => {
    alert(error.message);
  });
  localStorage.clear();
}

export async function loginwithgoogle() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const { user } = await signInWithPopup(auth, provider);
  return user;
}

export async function addnote(uid, note) {
  // access users collection then uid then add notes to notesarray
  const channelsRef = collection(db, "users");
  const docRef = doc(channelsRef, uid.toString());
  await updateDoc(
    docRef,
    {
      notes: arrayUnion(note),
    },
    { merge: true }
  );
}

export async function addtodo(uid, todo) {
  const channelsRef = collection(db, "users");
  const docRef = doc(channelsRef, uid);
  await updateDoc(
    docRef,
    {
      ToDo: arrayUnion(todo),
    },
    { merge: true }
  );
}

export async function createnotes(uid) {
  const channelsRef = collection(db, "users");
  const docRef = doc(channelsRef, uid.toString());
  await setDoc(docRef, { notes: [], notecount: 0 }, { merge: true });
}

export async function getnotes(uid) {
  const usersref = collection(db, "users");
  const docRef = doc(usersref, uid);
  const querySnapshot = await getDoc(docRef);
  const notes = querySnapshot.data();
  if (notes) {
    return notes.notes;
  } else {
    await createnotes(uid);
    return await getnotes(uid);
  }
}

export async function getTodos(uid) {
  const usersref = collection(db, "users");
  const docRef = doc(usersref, uid);
  const querySnapshot = await getDoc(docRef);
  const todos = querySnapshot.data();
  if (todos) {
    return todos.ToDo;
  } else {
    await createTodo(uid);
    return await getTodos(uid);
  }
}

export async function createTodo(uid) {
  const channelsRef = collection(db, "users");
  const docRef = doc(channelsRef, uid.toString());
  // await setDoc(docRef, { ToDo: [], todocount: 0 });

  // set the doc to the already existing data and add the notes array to the doc
  await setDoc(docRef, { ToDo: [], todocount: 0 }, { merge: true });
}

export async function toggletodo(userUID, todoId) {
  const channelsRef = collection(db, "users");
  const docRef = doc(channelsRef, userUID);

  const todos = await getTodos(userUID);
  const newTodos = todos.map((todo) => {
    if (todo.todoId === todoId) {
      // Create a new object with the updated isDone property
      return {
        ...todo,
        isDone: !todo.isDone,
      };
    }
    return todo;
  });

  await setDoc(
    docRef,
    {
      ToDo: newTodos,
    },
    { merge: true }
  );
}

export async function deletetodo(uid, todoId) {
  const channelsRef = collection(db, "users");
  const docRef = doc(channelsRef, uid);
  const todos = await getTodos(uid);
  const newTodos = todos.filter((todo) => todo.todoId !== todoId);
  await updateDoc(docRef, {
    ToDo: newTodos,
  });
}

export async function editnote(uid, noteId, newNote) {
  const channelsRef = collection(db, "users");
  const docRef = doc(channelsRef, uid);
  const notes = await getnotes(uid);
  const todos = await getTodos(uid);
  const counts = await getnotesandtodocount(uid);
  const index = notes.findIndex((note) => note.noteId === noteId);
  const newNotes = notes;
  newNotes[index] = newNote;
  // console.log(counts);
  // const newNotes = notes.map((note) => {
  //   if (note.noteId === noteId) {
  //     return {
  //       note: newNote,
  //     };
  //   }
  //   return note;
  // });
  // console.log(newNotes);
  await updateDoc(docRef, {
    notecount: counts.notescount,
    todocount: counts.todocount,
    ToDo: todos,
    notes: newNotes,
  });
}

export async function getnotesandtodocount(uid) {
  const channelsRef = collection(db, "users");
  const docRef = doc(channelsRef, uid);
  const querySnapshot = await getDoc(docRef);
  const counter = querySnapshot.data();
  if (counter) {
    const notescount = counter.notecount;
    const todocount = counter.todocount;
    // console.log(notescount, todocount);
    return { notescount, todocount };
  } else {
    await createnotes(uid);
    await createTodo(uid);
    return await getnotesandtodocount(uid);
  }
}

export async function updatenotescount(uid, newcount) {
  const channelsRef = collection(db, "users");
  const docRef = doc(channelsRef, uid);
  await updateDoc(docRef, {
    notecount: newcount,
  });
  console.log("updated to", newcount);
}

export async function updatetodocount(uid, newcount) {
  const channelsRef = collection(db, "users");
  const docRef = doc(channelsRef, uid);
  await updateDoc(docRef, {
    todocount: newcount,
  });
}

export async function deletenote(uid, noteid) {
  const channelsRef = collection(db, "users");
  const docRef = doc(channelsRef, uid);
  const notes = await getnotes(uid);
  const newNotes = notes.filter((note) => note.noteId !== noteid);
  await updateDoc(docRef, {
    notes: newNotes,
  });
}
