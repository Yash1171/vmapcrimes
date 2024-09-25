import Dashboard from "./Pages/home/Dashboard";
import Login from "./login/Login";
import Logout from "./Pages/logout/Logout"
import UpdateUser from "./Pages/updateUser/UpdateUser"
import { BrowserRouter,  Routes,  Route} from "react-router-dom";
import Single from "./Pages/single/Single";
import New from "./Pages/new/New";
import List from "./Pages/list/List";
import Location from "./Pages/location/Location";
import Fir from "./Pages/fir/Fir";
import { userInputs } from "./formSource";
import Roles from "./Pages/roles/Roles";
import Newroles from "./Pages/newroles/Newroles";
import UpdateRole from "./Pages/updateRole/UpdateRole"
import "./style/dark.scss"
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import UserState from "./context/UserState";
import MapState from "./context/MapState"
import Mainwebsite from "./Pages/mainwebsite/Mainwebsite"
import Analytics from "./Pages/mainwebsite/Analytics"
function App() {

  const{darkMode} = useContext(DarkModeContext)
  return (
    <div className={ darkMode ? "app dark": "app"}>
      <UserState>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<MapState><Mainwebsite/></MapState>} />
            <Route path="logout" element={<Logout />}></Route>
            <Route path="analytics" element={<Analytics />}></Route>

            <Route path="login" element={<Login/>} />
            <Route path="location" element={<Location/>} />
            <Route path="fir" element={<Fir/>} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="roles">
              <Route index element={<Roles/>}/>
              <Route path="update/:roleId" index element={<UpdateRole/>}/>
            </Route>
            <Route path="newroles" element={<Newroles/>} />
            <Route path="users">
              <Route index element={<List/>}/>
              <Route path=":userId" index element={<Single/>}/>
              <Route path="update/:userId" index element={<UpdateUser/>}/>
              <Route path="new" element={<New inputs={userInputs} title="Add New User"/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      </UserState>
    </div>
  );
}

export default App;
