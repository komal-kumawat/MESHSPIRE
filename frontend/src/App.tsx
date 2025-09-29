import { BrowserRouter, Route, Routes  } from "react-router-dom"
import LandingPage from "./Pages/LandingPage"
import Signin from "./Pages/Signin"
import Signup from "./Pages/Signup"
import Dashboard from "./Pages/Dashboard"
import{ Room } from "./Pages/RoomPage"

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<LandingPage/>}></Route>
      <Route path = "/signin" element = {<Signin/>}></Route>
      <Route path = "/signup" element = {<Signup/>}></Route>
      <Route path = "/dashboard" element = {<Dashboard/>}></Route>
      <Route path = "/room/:roomid" element = {<Room/>}></Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App
