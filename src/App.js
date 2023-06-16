import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import UserProvider from "./components/UserProvider";

function App() {
  return (
    <div className="App">
      <UserProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Welcome" element={<Welcome />} />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
