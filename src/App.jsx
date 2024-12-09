import axios from "axios";
import {  UserContextProvider } from "./components/UserContext";
import Route from "./components/Route";

function App() {
  axios.defaults.baseURL = "http://localhost:3003";
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <Route />
    </UserContextProvider>
  );
}

export default App;
