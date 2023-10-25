import { Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { Home } from "./home/Home";
import { DungeonForm } from "./dungeon/DungeonForm";
import { EditDungeonForm } from "./dungeon/EditDungeonForm";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}> 
              <Home loggedInUser={loggedInUser}   />
            </AuthorizedRoute>
          }
          />
          <Route path="/new" element = {<DungeonForm  loggedInUser={loggedInUser}/>} />
          <Route path="/edit/:udId" element = {<EditDungeonForm  loggedInUser={loggedInUser}/>} />
          <Route
            path="login"
            element={<Login setLoggedInUser={setLoggedInUser} />}
          />
        <Route
          path="register"
          element={<Register setLoggedInUser={setLoggedInUser} />}
        />
      </Route>
      <Route path="*" element={<p>Whoops, nothing here...</p>} />
    </Routes>
  );
}
