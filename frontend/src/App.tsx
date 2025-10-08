import { BrowserRouter, Route, Routes  } from "react-router-dom"
import Signin from "./Pages/Signin"
import Signup from "./Pages/Signup"
import Dashboard from "./Pages/Dashboard"
import Room  from "./Pages/RoomPage"
import Meeting from "./Pages/Meeting"
import Profile from "./Pages/Profile"
import UpdateProfile from "./Pages/UpdateProfile"

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<Signup/>}></Route>
      <Route path = "/signin" element = {<Signin/>}></Route>
      <Route path = "/dashboard" element = {<Dashboard/>}></Route>
      <Route path = "/room/:roomid" element = {<Room/>}></Route>
      <Route path="/meeting" element={<Meeting/>}></Route>
      <Route path="/profile/:id" element = {<Profile/>}></Route>
      <Route path="/update-profile" element={<UpdateProfile/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
