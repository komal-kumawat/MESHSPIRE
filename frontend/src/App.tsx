import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/landing";
import SignInPage from "./Pages/SigninPage";
import SignUpPage from "./Pages/SignupPage";
import DashboardPage from "./Pages/DashboardPage";
import { AuthProvider } from "./Context/AuthContext";
import RoomPage from "./Pages/RoomPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/room/:id" element={<RoomPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
