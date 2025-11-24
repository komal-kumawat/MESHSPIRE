import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./Pages/Auth";
import Dashboard from "./Pages/Dashboard";
import Room from "./Pages/RoomPage";
import Meeting from "./Pages/Meeting";
import Profile from "./Pages/Profile";
import UpdateProfile from "./Pages/UpdateProfile";
import ProtectedRoute from "./Components/PrivateRoute";
import NotFound from "./Pages/NotFound";
import DashboardLayout from "./Pages/DashboardLayout";
import TutorDashboard from "./Pages/TutorDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<AuthPage />} />
        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meeting" element={<Meeting />} />
        </Route>

        <Route
          path="/tutor-dashboard"
          element={
            <ProtectedRoute>
              <TutorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/room/:roomid"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-profile"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
